import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

// This should match the type definition used across your app
type Problem = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  topicId?: string;
};

interface EditProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (problem: Problem) => void;
  problem: Problem | null | undefined;
}

const initialState: Problem = {
  id: "",
  title: "",
  difficulty: "easy",
  tags: [],
};

export function EditProblemModal({
  isOpen,
  onClose,
  onSave,
  problem: problemToEdit,
}: EditProblemModalProps) {
  const [problem, setProblem] = useState<Problem>(initialState);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (problemToEdit) {
      setProblem(problemToEdit);
      setTagInput(problemToEdit.tags.join(", "));
    } else {
      // Reset form when there's no problem to edit (e.g., modal is closed)
      setProblem(initialState);
      setTagInput("");
    }
  }, [problemToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProblem((prev) => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (value: "easy" | "medium" | "hard") => {
    setProblem((prev) => ({ ...prev, difficulty: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleSave = () => {
    if (!problem.title) {
      toast.error("Title is required.");
      return;
    }
    if (!problem.id) {
      toast.error("Cannot save problem without an ID.");
      return;
    }

    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSave({ ...problem, tags });
    onClose(); // No need to call handleClose, onClose from props handles it
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Problem</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={problem.title}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Difficulty
            </Label>
            <Select
              onValueChange={handleDifficultyChange}
              value={problem.difficulty}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              name="tags"
              value={tagInput}
              onChange={handleTagChange}
              className="col-span-3"
              placeholder="e.g. array, string, sorting"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
