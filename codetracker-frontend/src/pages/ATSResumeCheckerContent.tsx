// src/pages/admin/ATSResumeCheckerContent
import { CreditPurchaseModal } from "@/components/ats/CreditPurchaseModal";
import { ResumeReportModal } from "@/components/ats/ResumeReportModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useATSResumeChecker, useAuth } from "@/hooks/useATSResumeChecker";
import { motion } from "framer-motion";
import { CreditCard, FileText, Star, Upload, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ATSResumeCheckerContent() {
  const { credits, resumes, loading, uploadResume, purchaseCredits } =
    useATSResumeChecker();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    if (credits < 1) {
      setShowPurchaseModal(true);
      return;
    }

    setAnalyzing(true);
    try {
      const result = await uploadResume(selectedFile);
      if (result.success) {
        if (result.analysisResult) {
          toast.success(
            `Analysis complete! ATS Score: ${result.analysisResult.score}/100`
          );
        } else {
          toast.error("Analysis result is missing.");
        }
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById(
          "resume-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(result.error || "Analysis failed");
      }
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
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

      {/* Credits and Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Resume</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center flex-1 flex flex-col justify-center items-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Choose a PDF file to analyze
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 5MB
                  </p>
                </div>
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="mt-4"
                />
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg gap-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <span
                      className="text-sm font-medium truncate"
                      title={selectedFile.name}
                    >
                      {selectedFile.name}
                    </span>
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing || credits < 1}
                    className="min-w-[120px]"
                  >
                    {analyzing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze (1 credit)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Credits Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Credits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{credits}</div>
                <p className="text-sm text-muted-foreground">
                  Available Credits
                </p>
              </div>

              <div className="flex-1" />

              <Button
                onClick={() => setShowPurchaseModal(true)}
                className="w-full"
                variant="outline"
              >
                Buy More Credits
              </Button>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• 1 credit per resume analysis</p>
                <p>• Detailed ATS compatibility report</p>
                <p>• Keyword optimization suggestions</p>
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
                        <p
                          className="font-medium truncate"
                          title={resume.fileName}
                        >
                          {resume.fileName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(resume.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 self-end sm:self-center flex-shrink-0">
                      <Badge className={getScoreColor(resume.atsScore)}>
                        <Star className="w-3 h-3 mr-1" />
                        {resume.atsScore}/100
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedResume({
                            id: resume.id,
                            fileName: resume.fileName,
                            atsScore: resume.atsScore,
                            analysisResult: resume.analysisResult,
                            uploadDate: resume.uploadDate,
                          });
                          setShowReportModal(true);
                        }}
                      >
                        View Report
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

      <CreditPurchaseModal
        open={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchase={purchaseCredits}
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
            <h2 className="text-2xl font-bold">
              Sign in to use ATS Resume Checker
            </h2>
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
