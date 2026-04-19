// src/pages/admin/ProblemFormModal
import { AdminProblem, AdminProblemRequest } from "@/api/adminAPI";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Topic } from "@/types/api";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  topics: Topic[];
  problem?: AdminProblem; // provided when editing
  onSave: (data: AdminProblemRequest) => Promise<void>;
  onClose: () => void;
}

interface UrlRow {
  platform: string;
  url: string;
}

export default function ProblemFormModal({ topics, problem, onSave, onClose }: Props) {
  const [title, setTitle] = useState(problem?.title ?? "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(problem?.difficulty ?? "easy");
  const [topicId, setTopicId] = useState(problem?.topicId ?? "");
  const [slug, setSlug] = useState(problem?.slug ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(problem?.tags ?? []);
  const [urls, setUrls] = useState<UrlRow[]>(
    problem?.externalUrls?.length ? problem.externalUrls : [{ platform: "", url: "" }]
  );
  const [saving, setSaving] = useState(false);

  // Auto-generate slug from title when creating
  useEffect(() => {
    if (!problem) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [title, problem]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const addUrl = () => setUrls((prev) => [...prev, { platform: "", url: "" }]);
  const removeUrl = (i: number) => setUrls((prev) => prev.filter((_, idx) => idx !== i));
  const updateUrl = (i: number, field: keyof UrlRow, value: string) =>
    setUrls((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title,
        difficulty,
        topicId,
        slug,
        tags,
        externalUrls: urls.filter((u) => u.platform && u.url),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{problem ? "Edit Problem" : "Add Problem"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Two Sum"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="two-sum"
              required
            />
          </div>

          {/* Difficulty + Topic row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as "easy" | "medium" | "hard")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Topic</Label>
              <Select value={topicId} onValueChange={setTopicId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag and press Enter"
              />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground"
                  >
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* External URLs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>External Links</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addUrl}>
                <Plus className="h-3 w-3 mr-1" /> Add Link
              </Button>
            </div>
            {urls.map((row, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={row.platform}
                  onChange={(e) => updateUrl(i, "platform", e.target.value)}
                  placeholder="LeetCode"
                  className="w-32 shrink-0"
                />
                <Input
                  value={row.url}
                  onChange={(e) => updateUrl(i, "url", e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                />
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUrl(i)}
                    className="shrink-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !topicId}>
              {saving ? "Saving..." : problem ? "Save Changes" : "Create Problem"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
