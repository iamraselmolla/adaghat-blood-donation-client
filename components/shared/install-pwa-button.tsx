"use client";

import * as React from "react";
import { Download, Share, X, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useInstallPrompt } from "../../hooks/use-install-prompt";

export function InstallPwaButton() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallPrompt();
  const [iosHintOpen, setIosHintOpen] = React.useState(false);

  // Nothing to offer: already installed, or platform gives us no install path.
  if (isInstalled || (!isInstallable && !isIOS)) return null;

  async function handleClick() {
    if (isIOS) {
      setIosHintOpen(true);
      return;
    }
    await promptInstall();
  }

  return (
    <>
      <Button variant="glass" size="sm" className="gap-2" onClick={handleClick}>
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Install App</span>
      </Button>

      <AnimatePresence>
        {iosHintOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setIosHintOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="bg-card border border-border/60 rounded-2xl p-5 max-w-sm w-full shadow-glass-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">Install LifeDrop</p>
                <button onClick={() => setIosHintOpen(false)} aria-label="Close">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tap the <Share className="inline h-4 w-4 mx-0.5 -mt-0.5" /> Share icon in Safari's toolbar, then
                scroll down and tap <span className="font-medium text-foreground">"Add to Home Screen"</span>{" "}
                <PlusSquare className="inline h-4 w-4 mx-0.5 -mt-0.5" />.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}