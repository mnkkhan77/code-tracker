import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BestTimeEditorProps {
  timeInSeconds: number | null;
  onSave: (newTimeInSeconds: number) => void;
}

const formatTime = (totalSeconds: number | null): string => {
  if (totalSeconds === null || totalSeconds < 0) return "--:--:--";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export function BestTimeEditor({ timeInSeconds, onSave }: BestTimeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [h, setH] = useState("00");
  const [m, setM] = useState("00");
  const [s, setS] = useState("00");

  useEffect(() => {
    if (timeInSeconds !== null) {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      setH(String(hours).padStart(2, "0"));
      setM(String(minutes).padStart(2, "0"));
      setS(String(seconds).padStart(2, "0"));
    }
  }, [timeInSeconds]);

  const handleSave = () => {
    const totalSeconds =
      parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseInt(s, 10);
    onSave(totalSeconds);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          type="text"
          value={h}
          onChange={(e) => setH(e.target.value)}
          className="w-12 h-8 text-center"
          maxLength={2}
        />
        <span>:</span>
        <Input
          type="text"
          value={m}
          onChange={(e) => setM(e.target.value)}
          className="w-12 h-8 text-center"
          maxLength={2}
        />
        <span>:</span>
        <Input
          type="text"
          value={s}
          onChange={(e) => setS(e.target.value)}
          className="w-12 h-8 text-center"
          maxLength={2}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleSave}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>{formatTime(timeInSeconds)}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setIsEditing(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
}
