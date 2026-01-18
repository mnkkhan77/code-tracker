import * as progressService from "@/services/progressService";
import { TopicWithStats, UserStatsDto } from "@/types/api";
import { useEffect, useState } from "react";

export function useDashboardStats() {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStatsDto | null>(null);
  const [topics, setTopics] = useState<TopicWithStats[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [statsRes, topicsRes] = await Promise.all([
          progressService.getUserStats(),
          progressService.getTopicsWithStats(),
        ]);

        if (!mounted) return;
        setUserStats(statsRes ?? null);
        setTopics(topicsRes ?? []);
        setUpcomingReviews(statsRes?.upcomingReviews ?? []);
      } catch (err: any) {
        console.error("Failed to fetch dashboard stats:", err?.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  return { loading, userStats, upcomingReviews, topics };
}
