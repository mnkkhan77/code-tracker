// Simple in-memory cache
const cache = new Map<string, any>();
// Simulate API latency and implement caching
const apiCall = <T>(key: string, dataFn: () => T, delay = 500): Promise<T> => {
  if (cache.has(key)) {
    // Return cached data immediately, simulating a super-fast API response
    return Promise.resolve(cache.get(key));
  }
  // If not in cache, "fetch" the data, then cache it for next time
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = dataFn();
      if (data) {
        cache.set(key, data);
      }
      resolve(data);
    }, delay);
  });
};
// Mock ATS analysis function
const mockATSAnalysis = (fileName: string) => {
  const mockResults = [
    {
      score: 85,
      feedback:
        "Strong resume with good keyword optimization. Consider adding more quantifiable achievements and ensuring consistent formatting throughout.",
    },
    {
      score: 72,
      feedback:
        "Good foundation but missing key technical skills. Add more industry-specific keywords and improve the summary section.",
    },
    {
      score: 91,
      feedback:
        "Excellent ATS-friendly resume! Well-structured with strong keyword density and clear formatting.",
    },
  ];
  // Return a random result for demo purposes
  return mockResults[Math.floor(Math.random() * mockResults.length)];
};
export const getUserCredits = () => {
  const key = "user_credits";
  return apiCall(key, () => {
    // Mock user starting with 0 credits
    return { credits: 0 };
  });
};
export const purchaseCredits = (packageType: "small" | "medium" | "large") => {
  const packages = {
    small: { credits: 10, price: 5 },
    medium: { credits: 20, price: 10 },
    large: { credits: 35, price: 20 },
  };
  const selectedPackage = packages[packageType];
  return new Promise<{ success: boolean; newCredits: number }>((resolve) => {
    setTimeout(() => {
      // Mock successful payment
      const currentCredits = cache.get("user_credits")?.credits || 0;
      const newCredits = currentCredits + selectedPackage.credits;
      // Update credits in cache
      cache.set("user_credits", { credits: newCredits });
      // Mock purchase record
      const purchases = cache.get("user_purchases") || [];
      purchases.push({
        creditsPurchased: selectedPackage.credits,
        amountPaid: selectedPackage.price,
        paymentId: `mock_payment_${Date.now()}`,
        date: Date.now(),
      });
      cache.set("user_purchases", purchases);
      resolve({ success: true, newCredits });
    }, 1000);
  });
};
export const uploadResumeForAnalysis = (file: File) => {
  return new Promise<{
    success: boolean;
    analysisResult?: any;
    error?: string;
  }>((resolve) => {
    setTimeout(() => {
      const currentCredits = cache.get("user_credits")?.credits || 0;
      if (currentCredits < 1) {
        resolve({ success: false, error: "Insufficient credits" });
        return;
      }
      // Deduct 1 credit
      cache.set("user_credits", { credits: currentCredits - 1 });
      // Mock analysis
      const analysis = mockATSAnalysis(file.name);
      // Store resume analysis
      const resumes = cache.get("user_resumes") || [];
      const newResume = {
        id: `${Date.now().toString()}-${Math.random().toString(36).slice(2)}`,
        fileName: file.name,
        analysisResult: analysis.feedback,
        atsScore: analysis.score,
        uploadDate: Date.now(),
      };
      resumes.push(newResume);
      cache.set("user_resumes", resumes);
      resolve({
        success: true,
        analysisResult: {
          score: analysis.score,
          feedback: analysis.feedback,
          resume: newResume,
        },
      });
    }, 2000); // Simulate analysis time
  });
};
export const getUserResumes = () => {
  const key = "user_resumes";
  return apiCall(key, () => cache.get("user_resumes") || []);
};
