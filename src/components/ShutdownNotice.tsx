import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Copy, Check, Sparkles, Send, GraduationCap, Heart } from 'lucide-react';
import { EVENT_CONFIG, type EventConfigType } from '../data/eventData';

interface ShutdownNoticeProps {
  config?: EventConfigType;
}

export function ShutdownNotice({ config = EVENT_CONFIG }: ShutdownNoticeProps) {
  const [copied, setCopied] = useState(false);
  const supportEmail = 'anosinx@gmail.com';

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(supportEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#F5A623] selection:text-[#09090B]">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] h-[340px] sm:h-[620px] bg-[#F5A623]/10 rounded-full blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-10 w-[240px] h-[240px] bg-amber-500/5 rounded-full blur-[100px]"
      />

      <motion.main
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        {/* University & Fest Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group mb-4">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#F5A623]/40 via-amber-300/30 to-[#F5A623]/40 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#121216] border border-white/10 flex items-center justify-center p-2.5 shadow-2xl">
              <img
                src="/kishkinda-logo.png"
                alt="Kishkinda University Logo"
                className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(245,166,35,0.4)]"
                onError={(e) => {
                  // Fallback to favicon or hide if missing
                  const target = e.currentTarget;
                  if (!target.src.includes('favicon.png')) {
                    target.src = '/favicon.png';
                  }
                }}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/25 text-xs font-semibold text-[#F5A623] tracking-wide mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SYNORA 2K26</span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            {config.collegeName} · AIML &amp; AIDS Department
          </p>
        </div>

        {/* Main Shutdown Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121216]/90 backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Subtle top gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5A623] to-transparent opacity-75" />

          {/* Heading */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
            Thanks for Visiting! <span className="inline-block animate-bounce">✨</span>
          </h1>

          {/* Shutdown notification badge / pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>The site has been Shutdown</span>
          </div>

          {/* Contact & Support Section */}
          <div className="text-left bg-black/40 border border-white/[0.06] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#F5A623]">
              <Mail className="w-4 h-4" />
              <span>Contact &amp; Support</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mb-4">
              For any query or support, please contact us:
            </p>

            {/* Email display bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#18181F] border border-white/10">
              <div className="flex items-center gap-2.5 px-2 py-1 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-mono text-sm sm:text-base font-medium text-amber-200 select-all truncate">
                  {supportEmail}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer"
                  title="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${supportEmail}?subject=Synora%202K26%20Query%20/%20Support`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F5A623] hover:bg-[#FFC04D] text-[#09090B] text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,166,35,0.25)] hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#09090B]" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Department badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>AIML &amp; AIDS Department · Kishkinda University</span>
          </div>
        </div>

        {/* Footer note */}
        <footer className="mt-8 text-center text-xs text-zinc-600 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>by AIML &amp; AIDS Department · Kishkinda University</span>
          </p>
          <p>© 2026 Synora 2K26. All rights reserved.</p>
        </footer>
      </motion.main>
    </div>
  );
}
