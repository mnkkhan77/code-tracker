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
import { useState } from "react";
import { toast } from "sonner";

// This should match the type definition used across your app
type Problem = {
  id?: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  // Add other fields as necessary, but keep them optional for creation
  topicId?: string;
};

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (problem: Omit<Problem, "id">) => void;
}

const initialState: Omit<Problem, "id"> = {
  title: "",
  difficulty: "easy",
  tags: [],
};

export function AddProblemModal({
  isOpen,
  onClose,
  onSave,
}: AddProblemModalProps) {
  const [problem, setProblem] = useState(initialState);
  const [tagInput, setTagInput] = useState("");

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

    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSave({ ...problem, tags });
    handleClose();
  };

  const handleClose = () => {
    setProblem(initialState);
    setTagInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
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
              defaultValue={problem.difficulty}
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
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save Problem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
