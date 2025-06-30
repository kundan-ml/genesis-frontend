import { useEffect, useState } from "react";
import { DownloadIcon } from "../Icons";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the PWA installation");
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      {!isInstalled && deferredPrompt && (
        <Button onClick={handleInstallClick} className="flex items-center gap-2">
          <DownloadIcon size={20} /> Install GenieGenesis
        </Button>
      )}
    </div>
  );
};

export default InstallApp;
