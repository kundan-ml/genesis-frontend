import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useState } from "react";
import Link from "next/link";
export default () => {
  const { theme } = useTheme(); // Get current theme
  const [imagePath, setImagePath] = useState("/images/screen.png");

  useEffect(() => {
    if (theme === "dark") {
      setImagePath("/images/screen.png");
    } else {
      setImagePath("/images/screen-light.png");
    }
  }, [theme]); // Add theme as a dependency

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
    <section className="relative max-w-screen-xl mx-auto py-10 px-4 md:px-8 dark:bg-neutral-800 bg-neutral-200">
      {/* Background overlay */}
      <div className="absolute top-0 left-0 w-full h-full dark:bg-neutral-800 opacity-30"></div>

      <div className="relative z-10 gap-5 items-center lg:flex">
        {/* Left content */}
        <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-lg lg:text-left">
          <h3 className="text-3xl dark:text-white font-semibold md:text-4xl">
            Generate Images with Your Prompt using{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">
              Genie Genesis
            </span>
          </h3>
          <p className="dark:text-gray-400 leading-relaxed mt-3">
            Discover the power of text-to-image generation with Genie Genesis.
            Create stunning visuals directly from your prompts, effortlessly
            and creatively.
          </p>
          <div
          onClick={handleInstallClick}
            // href="/app"
            className="mt-5 cursor-pointer  px-4 py-2 text-indigo-400 font-medium bg-indigo-900 rounded-full inline-flex items-center hover:bg-indigo-700 transition duration-300"
          >
            Install Genie Genesis
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 mt-5 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
          <img
            src={imagePath}
            alt="GENIE Genesis Screenshot"
            className="w-full rounded-lg shadow-md border dark:border-gray-100 border-gray-700 "
          />
        </div>
      </div>
    </section>
  );
};
