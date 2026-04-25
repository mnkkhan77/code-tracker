// src/pages/admin/ATSResumeCheckerContent
import { AnalysisMode } from "@/api/atsAPI";
import { CreditPurchaseModal } from "@/components/ats/CreditPurchaseModal";
import { ResumeReportModal } from "@/components/ats/ResumeReportModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useATSResumeChecker, useAuth } from "@/hooks/useATSResumeChecker";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardPaste,
  CreditCard,
  FileText,
  Lightbulb,
  Star,
  Trash2,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ANALYSIS_MODES: {
  value: AnalysisMode;
  label: string;
  description: string;
  credits: number;
  icon: React.ReactNode;
}[] = [
  {
    value: "standard",
    label: "ATS Check",
    description: "General ATS compatibility analysis",
    credits: 1,
    icon: <Zap className="w-4 h-4" />,
  },
  {
    value: "detailed",
    label: "Deep Enhancement",
    description: "Exact rewrites for every weak section",
    credits: 2,
    icon: <Lightbulb className="w-4 h-4" />,
  },
];

function ATSResumeCheckerContent() {
  const { credits, resumes, loading, uploadResume, deleteResume } =
    useATSResumeChecker();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jdDraft, setJdDraft] = useState("");
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("standard");
  const [analyzing, setAnalyzing] = useState(false);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showJdModal, setShowJdModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<any>(null);

  const selectedMode = ANALYSIS_MODES.find((m) => m.value === analysisMode)!;
  const hasJd = analysisMode === "standard" && jobDescription.trim().length > 0;
  const creditCost = hasJd ? 2.5 : selectedMode.credits;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    if (credits < creditCost) {
      setShowPurchaseModal(true);
      return;
    }
    setAnalyzing(true);
    try {
      const result = await uploadResume(selectedFile, jobDescription.trim(), analysisMode);
      if (result.success) {
        if (result.status === "FAILED") {
          toast.warning("Resume uploaded but analysis failed. Please try again or check your file.");
        } else {
          toast.success("Resume analyzed successfully!");
        }
        setSelectedFile(null);
        const fileInput = document.getElementById("resume-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;
    await deleteResume(resumeToDelete);
    setResumeToDelete(null);
  };

  const openJdModal = () => {
    setJdDraft(jobDescription);
    setShowJdModal(true);
  };

  const saveJd = () => {
    setJobDescription(jdDraft);
    setShowJdModal(false);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJdDraft(text);
    } catch {
      toast.error("Clipboard access denied. Please paste manually.");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score > 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          ATS Resume Checker
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Optimize your resume for Applicant Tracking Systems and increase your
          chances of getting hired.
        </p>
      </motion.div>

      {/* Upload + Credits */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Resume</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Analysis mode selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">Analysis Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {ANALYSIS_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setAnalysisMode(mode.value)}
                      className={`flex flex-col items-start p-3 rounded-lg border text-left transition-colors ${
                        analysisMode === mode.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-medium text-sm mb-0.5 w-full">
                        {mode.icon}
                        {mode.label}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {mode.value === "standard" && hasJd ? "2.5" : mode.credits} cr
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{mode.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* JD button — compact, no layout shift */}
              {analysisMode === "standard" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={openJdModal}
                    className="text-xs"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5 mr-1.5" />
                    {jobDescription.trim() ? "Edit Job Description" : "Add Job Description"}
                    <span className="ml-1.5 text-muted-foreground">(+1.5 cr)</span>
                  </Button>
                  {jobDescription.trim() && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      JD added
                      <button
                        type="button"
                        onClick={() => setJobDescription("")}
                        className="ml-0.5 text-muted-foreground hover:text-destructive"
                        title="Remove JD"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* File drop zone — fixed height, no shifts */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center flex flex-col justify-center items-center h-[200px]">
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <>
                    <FileText className="w-10 h-10 text-primary mb-3" />
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm font-medium truncate max-w-[200px]" title={selectedFile.name}>
                        {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          const fi = document.getElementById("resume-upload") as HTMLInputElement;
                          if (fi) fi.value = "";
                        }}
                        className="text-muted-foreground hover:text-destructive flex-shrink-0"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <Button onClick={handleAnalyze} disabled={analyzing} className="min-w-[160px]">
                      {analyzing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <>
                          {selectedMode.icon}
                          <span className="ml-2">
                            Analyze ({creditCost} credit{creditCost !== 1 ? "s" : ""})
                          </span>
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <FileText className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium mb-1">Choose a PDF file to analyze</p>
                    <p className="text-xs text-muted-foreground mb-4">Maximum file size: 5MB</p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("resume-upload")?.click()}
                      type="button"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Credits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-2">
                <div className="text-4xl font-bold text-primary">{credits}</div>
                <p className="text-sm text-muted-foreground mt-1">Available Credits</p>
              </div>
              <Button onClick={() => setShowPurchaseModal(true)} className="w-full" variant="outline">
                Buy More Credits
              </Button>
              <div className="text-xs text-muted-foreground space-y-1 pt-1">
                <p>• 1 credit — ATS check (no JD)</p>
                <p>• 2.5 credits — ATS check with job description</p>
                <p>• 2 credits — Deep enhancement suggestions</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Previous Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Previous Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {resumes.length > 0 ? (
              <div className="space-y-4">
                {resumes.map((resume: any) => (
                  <div
                    key={resume.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex w-full flex-1 items-center space-x-4 min-w-0 sm:w-auto">
                      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate" title={resume.filename}>
                          {resume.filename}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(resume.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                      {resume.status === "FAILED" ? (
                        <Badge variant="outline" className="text-red-500 border-red-300">Failed</Badge>
                      ) : resume.status === "ANALYZING" ? (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-300">Analyzing...</Badge>
                      ) : resume.atsScore != null ? (
                        <Badge className={getScoreColor(resume.atsScore)}>
                          <Star className="w-3 h-3 mr-1" />
                          {resume.atsScore}/100
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
                      )}
                      {resume.status === "COMPLETED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedResume({
                              id: resume.id,
                              fileName: resume.filename,
                              atsScore: resume.atsScore,
                              analysisResult: resume.analysisResult,
                              uploadDate: resume.uploadedAt,
                            });
                            setShowReportModal(true);
                          }}
                        >
                          View Report
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setResumeToDelete(resume.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No analyses yet. Upload your first resume to get started!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Description Modal */}
      <Dialog open={showJdModal} onOpenChange={setShowJdModal}>
        <DialogContent className="w-[95vw] max-w-2xl rounded-md">
          <DialogHeader>
            <DialogTitle>Add Job Description</DialogTitle>
            <DialogDescription>
              Paste the job description to match your resume against it. This enables keyword comparison and costs 2.5 credits instead of 1.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={pasteFromClipboard}
              className="text-xs"
            >
              <ClipboardPaste className="w-3.5 h-3.5 mr-1.5" />
              Paste from Clipboard
            </Button>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={10}
              placeholder="Paste the job description here..."
              value={jdDraft}
              onChange={(e) => setJdDraft(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setJdDraft("");
                setJobDescription("");
                setShowJdModal(false);
              }}
            >
              Clear & Close
            </Button>
            <Button onClick={saveJd} disabled={!jdDraft.trim()}>
              Apply Job Description
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!resumeToDelete} onOpenChange={(open) => !open && setResumeToDelete(null)}>
        <DialogContent className="w-[95vw] max-w-md rounded-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Resume Report
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-1">
              <span className="block">
                This will permanently delete the resume and its analysis report. This action cannot be undone.
              </span>
              <span className="block font-medium text-foreground">
                Credits used for this analysis will not be refunded.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setResumeToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreditPurchaseModal
        open={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />

      {selectedResume && (
        <ResumeReportModal
          open={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setSelectedResume(null);
          }}
          resume={selectedResume}
        />
      )}
    </div>
  );
}

export default function ATSResumeChecker() {
  const { isAuthenticated, signIn } = useAuth();
  return (
    <>
      {isAuthenticated ? (
        <ATSResumeCheckerContent />
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Sign in to use ATS Resume Checker</h2>
            <p className="text-muted-foreground">
              Please sign in to analyze your resumes and manage credits.
            </p>
            <Button onClick={signIn}>Sign In</Button>
          </div>
        </div>
      )}
    </>
  );
}
