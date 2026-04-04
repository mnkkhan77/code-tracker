import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Lightbulb,
  Star,
  Target,
  XCircle,
} from "lucide-react";

interface ResumeReportModalProps {
  open: boolean;
  onClose: () => void;
  resume: {
    id: string;
    fileName: string;
    atsScore?: number;
    analysisResult?: any;
    uploadDate: string | number;
    detailedAnalysis?: {
      keywordMatches: string[];
      missingKeywords: string[];
      formatIssues: string[];
      strengths: string[];
      improvements: string[];
      sections: {
        name: string;
        score: number;
        feedback: string;
      }[];
    };
  };
}

export function ResumeReportModal({
  open,
  onClose,
  resume,
}: ResumeReportModalProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score > 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-700";
    if (score > 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getScoreIcon = (score: number) => {
    const color = getScoreColor(score);
    if (score >= 85) return <CheckCircle className={`w-8 h-8 ${color}`} />;
    if (score > 70) return <AlertCircle className={`w-8 h-8 ${color}`} />;
    return <XCircle className={`w-8 h-8 ${color}`} />;
  };

  const analysis = resume.analysisResult || null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl rounded-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>ATS Analysis Report</span>
              </DialogTitle>
              <DialogDescription>
                A detailed analysis of your resume's compatibility with
                Applicant Tracking Systems.
              </DialogDescription>
            </div>
            {/* 
            <Button 
              variant="outline" 
              onClick={downloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            */}
          </div>
        </DialogHeader>

        <div
          className="space-y-6 overflow-x-hidden" /*id="resume-report-content"*/
        >
          {/* Header with file info and overall score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg truncate">
                {resume.fileName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Analyzed on {new Date(resume.uploadDate).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              {resume.atsScore != null ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    {getScoreIcon(resume.atsScore)}
                    <div>
                      <div className={`text-2xl font-bold ${getScoreColor(resume.atsScore)}`}>
                        {resume.atsScore}/100
                      </div>
                      <p className="text-sm text-muted-foreground">ATS Compatibility Score</p>
                    </div>
                  </div>
                  <div className="w-2/5 sm:w-1/3">
                    <Progress value={resume.atsScore} className="h-3" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <AlertCircle className="w-8 h-8" />
                  <div>
                    <p className="font-medium">Analysis Pending</p>
                    <p className="text-sm">ATS scoring is not yet available for this resume.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section Scores */}
          {analysis && <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Section Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.sections?.map((section: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h4
                          className="font-medium truncate"
                          title={section.name}
                        >
                          {section.name}
                        </h4>
                        <Badge
                          className={`flex-shrink-0 ${getScoreBadgeColor(section.score)}`}
                        >
                          {section.score}/100
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground break-words">
                        {section.feedback}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>}

          {/* Keywords Analysis — only shown when JD matching was used */}
          {analysis && (analysis.keywordMatches?.length > 0 || analysis.missingKeywords?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {analysis.keywordMatches?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Matched Keywords</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordMatches.map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              {analysis.missingKeywords?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Missing Keywords</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Strengths and Improvements */}
          {analysis && <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths?.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Improvements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.improvements?.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>}

          {/* Format Issues */}
          {analysis?.formatIssues?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center space-x-2">
                  <XCircle className="w-5 h-5" />
                  <span>Format Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.formatIssues.map((issue: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Overall Feedback */}
          {analysis?.overallFeedback && (
            <Card>
              <CardHeader>
                <CardTitle>Overall Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed break-words">
                  {analysis.overallFeedback}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Detailed Enhancements — only present for "detailed" analysis mode */}
          {analysis?.detailedEnhancements?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span>Detailed Enhancement Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.detailedEnhancements.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {item.section}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{item.issue}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Before</p>
                          <p className="text-sm bg-red-50 border border-red-100 rounded p-2 break-words text-red-900">
                            {item.originalText}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">After</p>
                          <p className="text-sm bg-green-50 border border-green-100 rounded p-2 break-words text-green-900">
                            {item.suggestedText}
                          </p>
                        </div>
                      </div>
                      {item.reason && (
                        <p className="text-xs text-muted-foreground italic">{item.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
