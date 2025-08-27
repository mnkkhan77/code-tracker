import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

export function AdBlockerDetector({ children }: { children: React.ReactNode }) {
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);

  useEffect(() => {
    // Create a bait element with multiple, common ad-related class names.
    const bait = document.createElement("div");
    bait.className = "adbox pub_300x250 text-ad-box ad-banner"; // A mix of common ad class names
    bait.style.position = "absolute";
    bait.style.left = "-9999px";
    bait.style.top = "-9999px";
    bait.style.width = "1px";
    bait.style.height = "1px";
    bait.setAttribute("aria-hidden", "true"); // Hide from screen readers

    document.body.appendChild(bait);

    // Use a longer timeout and check the most reliable properties.
    const timer = setTimeout(() => {
      // If the element is not rendered (offsetParent is null) or its height is 0, it's blocked.
      if (bait.offsetHeight === 0 || bait.offsetParent === null) {
        setAdBlockerDetected(true);
        console.warn("Ad blocker detected via DOM bait element.");
      }

      // Clean up the bait element
      if (document.body.contains(bait)) {
        document.body.removeChild(bait);
      }
    }, 300); // Increased timeout to 300ms

    // Cleanup function to remove the element and timer if the component unmounts
    return () => {
      clearTimeout(timer);
      if (document.body.contains(bait)) {
        document.body.removeChild(bait);
      }
    };
  }, []);

  if (adBlockerDetected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Ad Blocker Detected</h1>
          <p className="text-muted-foreground">
            Ads help us maintain our servers and keep this service running.
          </p>
          <p className="text-muted-foreground mt-2">
            Please consider whitelisting this website to support us.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
