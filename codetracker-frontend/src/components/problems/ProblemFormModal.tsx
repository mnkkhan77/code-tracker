import { Problem } from "@/api/adminAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, X } from "lucide-react";
import { memo, useEffect, useState } from "react";

interface ProblemFormModalProps {
  problem: Partial<Problem> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (problem: Partial<Problem>) => void;
}

const PREDEFINED_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "DFS",
  "BFS",
  "Tree",
  "Graph",
  "Binary Search",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Queue",
  "Heap",
  "Linked List",
];

function ProblemFormModalComponent({
  problem,
  isOpen,
  onClose,
  onSave,
}: ProblemFormModalProps) {
  const getDifficultyColor = (difficulty: "easy" | "medium" | "hard") => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };
  const [formData, setFormData] = useState<Partial<Problem>>({});
  const [currentUrl, setCurrentUrl] = useState({ platform: "", url: "" });
  const [errors, setErrors] = useState<{
    title?: string;
    topicName?: string;
    tags?: string;
    currentUrl?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      if (problem) {
        setFormData({
          ...problem,
          externalUrls: problem.externalUrls || [],
        });
      } else {
        setFormData({
          title: "",
          difficulty: "easy",
          tags: [],
          topicName: "",
          externalUrls: [],
        });
      }
      setErrors({});
      setCurrentUrl({ platform: "", url: "" });
    }
  }, [problem, isOpen]);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validate = () => {
    const newErrors: {
      title?: string;
      topicName?: string;
      tags?: string;
      currentUrl?: string;
    } = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.topicName) newErrors.topicName = "Topic name is required";
    if (!formData.tags || formData.tags.length === 0)
      newErrors.tags = "At least one tag is required";

    if (currentUrl.url && !isValidUrl(currentUrl.url)) {
      newErrors.currentUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const handleTagSelect = (tag: string) => {
    setFormData((prev) => {
      const newTags = prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag];
      return { ...prev, tags: newTags };
    });
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addUrl = () => {
    if (currentUrl.platform.trim() && currentUrl.url.trim()) {
      if (!isValidUrl(currentUrl.url)) {
        setErrors((prev) => ({
          ...prev,
          currentUrl: "Please enter a valid URL",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        externalUrls: [...(prev.externalUrls || []), currentUrl],
      }));
      setCurrentUrl({ platform: "", url: "" });
      setErrors((prev) => ({ ...prev, currentUrl: "" }));
    }
  };

  const removeUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      externalUrls: prev.externalUrls?.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{problem ? "Edit Problem" : "Add Problem"}</DialogTitle>
          <DialogDescription>
            {problem
              ? "Edit the details of the problem. Click save when you're done."
              : "Add a new problem to the system. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty || "easy"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    difficulty: value as "easy" | "medium" | "hard",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              {/* ✅ Use exactly the same Badge structure as working example */}
              <Badge
                variant="outline"
                className={`capitalize ${getDifficultyColor(
                  formData.difficulty || "easy"
                )}`}
              >
                {formData.difficulty}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topicName">Topic</Label>
              <Input
                id="topicName"
                value={formData.topicName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, topicName: e.target.value })
                }
              />
              {errors.topicName && (
                <p className="text-sm text-red-500">{errors.topicName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {formData.tags?.length || 0 > 0
                      ? `${formData.tags?.length} selected`
                      : "Select tags"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
                {PREDEFINED_TAGS.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={formData.tags?.includes(tag)}
                    onCheckedChange={() => handleTagSelect(tag)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    className="rounded-full hover:bg-background/50 p-0.5"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {errors.tags && (
              <p className="text-sm text-red-500">{errors.tags}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>External URLs</Label>
            <div className="space-y-2 mb-2">
              <div className="flex gap-2">
                <Input
                  value={currentUrl.platform}
                  onChange={(e) =>
                    setCurrentUrl((prev) => ({
                      ...prev,
                      platform: e.target.value,
                    }))
                  }
                  placeholder="Platform (e.g., LeetCode)"
                  className="flex-1"
                />
                <Input
                  value={currentUrl.url}
                  onChange={(e) => {
                    setCurrentUrl((prev) => ({ ...prev, url: e.target.value }));
                    if (errors.currentUrl) {
                      const newErrors = { ...errors };
                      delete newErrors.currentUrl;
                      setErrors(newErrors);
                    }
                  }}
                  placeholder="URL"
                  className={`flex-2 ${errors.currentUrl ? "border-red-500" : ""}`}
                />
                <Button type="button" onClick={addUrl} size="sm">
                  Add
                </Button>
              </div>
              {errors.currentUrl && (
                <p className="text-sm text-red-500">{errors.currentUrl}</p>
              )}
            </div>
            <div className="space-y-1">
              {formData.externalUrls?.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                >
                  <span>
                    {url.platform}: {url.url}
                  </span>
                  <X
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => removeUrl(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ProblemFormModal = memo(ProblemFormModalComponent);
