package com.codetracker.codetracker_backend.specification;

import com.codetracker.codetracker_backend.constants.ProgressStatusConstants;
import com.codetracker.codetracker_backend.entity.Problem;
import com.codetracker.codetracker_backend.entity.Tag;
import com.codetracker.codetracker_backend.entity.UserProgress;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ProblemSpecification {

    public static Specification<Problem> withFilters(
            String difficulty, List<String> tags, String search, String sortBy, String sortDir) {
        return withUserFilters(null, difficulty, tags, search, null, null, sortBy, sortDir);
    }

    public static Specification<Problem> withTopicFilters(
            UUID topicId, String difficulty, List<String> tags,
            String search, String sortBy, String sortDir) {
        return withUserFilters(topicId, difficulty, tags, search, null, null, sortBy, sortDir);
    }

    public static Specification<Problem> withTopicUserFilters(
            UUID topicId, String difficulty, List<String> tags,
            String search, String status, UUID userId,
            String sortBy, String sortDir) {
        return withUserFilters(topicId, difficulty, tags, search, status, userId, sortBy, sortDir);
    }

    /**
     * Returns an unsorted Pageable when sortBy requires a custom ORDER BY expression
     * (difficulty CASE or bestTime JOIN). Spring Data JPA only overrides the ORDER BY
     * set inside toPredicate() when the Pageable itself is sorted; stripping the sort
     * lets the Specification control ordering.
     */
    public static Pageable effectivePageable(Pageable pageable, String sortBy) {
        if ("difficulty".equalsIgnoreCase(sortBy) || "bestTime".equalsIgnoreCase(sortBy)) {
            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        }
        return pageable;
    }

    private static Specification<Problem> withUserFilters(
            UUID topicId, String difficulty, List<String> tags,
            String search, String status, UUID userId,
            String sortBy, String sortDir) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (topicId != null) {
                predicates.add(cb.equal(root.get("topic").get("id"), topicId));
            }

            if (difficulty != null && !difficulty.isBlank()) {
                Expression<String> diffAsText = cb.function("text", String.class, root.get("difficulty"));
                predicates.add(cb.equal(cb.lower(diffAsText), difficulty.toLowerCase()));
            }

            if (query != null && tags != null && !tags.isEmpty()) {
                for (String tagName : tags) {
                    Subquery<Long> tagSubquery = query.subquery(Long.class);
                    Root<Problem> subRoot = tagSubquery.from(Problem.class);
                    Join<Problem, Tag> tagJoin = subRoot.join("tags");
                    tagSubquery.select(cb.literal(1L))
                            .where(
                                    cb.equal(subRoot.get("id"), root.get("id")),
                                    cb.equal(tagJoin.get("name"), tagName)
                            );
                    predicates.add(cb.exists(tagSubquery));
                }
            }

            if (query != null && status != null && !status.isBlank() && userId != null) {
                if (ProgressStatusConstants.NOT_STARTED.equals(status)) {
                    Subquery<UUID> startedSubquery = query.subquery(UUID.class);
                    Root<UserProgress> startedRoot = startedSubquery.from(UserProgress.class);
                    startedSubquery.select(startedRoot.get("problem").get("id"))
                            .where(
                                    cb.equal(startedRoot.get("user").get("id"), userId),
                                    startedRoot.get("status").in(ProgressStatusConstants.IN_PROGRESS, ProgressStatusConstants.COMPLETED)
                            );
                    predicates.add(cb.not(root.get("id").in(startedSubquery)));
                } else {
                    Subquery<UUID> progressSubquery = query.subquery(UUID.class);
                    Root<UserProgress> upRoot = progressSubquery.from(UserProgress.class);
                    progressSubquery.select(upRoot.get("problem").get("id"))
                            .where(
                                    cb.equal(upRoot.get("user").get("id"), userId),
                                    cb.equal(upRoot.get("status"), status)
                            );
                    predicates.add(root.get("id").in(progressSubquery));
                }
            }

            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
            }

            // Custom ORDER BY — only for data queries (not COUNT)
            if (query != null && sortBy != null && !Long.class.equals(query.getResultType())) {
                boolean asc = !"desc".equalsIgnoreCase(sortDir);
                if ("difficulty".equalsIgnoreCase(sortBy)) {
                    Expression<String> diffText = cb.lower(cb.function("text", String.class, root.get("difficulty")));
                    Expression<Integer> diffOrder = cb.<Integer>selectCase()
                            .when(cb.equal(diffText, "easy"), 1)
                            .when(cb.equal(diffText, "medium"), 2)
                            .when(cb.equal(diffText, "hard"), 3)
                            .otherwise(4);
                    query.orderBy(asc ? cb.asc(diffOrder) : cb.desc(diffOrder));
                } else if ("bestTime".equalsIgnoreCase(sortBy) && userId != null) {
                    Join<Problem, UserProgress> progressJoin = root.join("progressList", JoinType.LEFT);
                    progressJoin.on(cb.equal(progressJoin.get("user").get("id"), userId));
                    Integer nullReplacement = asc ? Integer.MAX_VALUE : -1;
                    Expression<Integer> coalesced = cb.coalesce(
                            progressJoin.<Integer>get("bestTime"), nullReplacement);
                    query.orderBy(asc ? cb.asc(coalesced) : cb.desc(coalesced));
                } else if ("title".equalsIgnoreCase(sortBy)) {
                    query.orderBy(asc ? cb.asc(root.get("title")) : cb.desc(root.get("title")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
