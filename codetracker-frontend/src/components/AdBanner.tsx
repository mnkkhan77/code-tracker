import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";

interface AdBannerProps {
  slot: string;
  className?: string;
}

export function AdBanner({ slot, className }: AdBannerProps) {
  const { isAdmin } = useAuth();
  const pushed = useRef(false);

  useEffect(() => {
    if (isAdmin || pushed.current || !slot) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, [isAdmin, slot]);

  const client = import.meta.env.VITE_ADSENSE_CLIENT;
  if (isAdmin || !client || !slot) return null;

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
