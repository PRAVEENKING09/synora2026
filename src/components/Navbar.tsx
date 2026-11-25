import { useState } from 'react';
import { Menu, X, Sparkles, Ticket, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { EVENT_CONFIG, type EventConfigType } from '../data/eventData';
import { AudioVibeToggle } from './AudioVibeToggle';

interface NavbarProps {
  hasIssuedPass: boolean;
  config?: EventConfigType;
  onOpenGoogleForm?: () => void;
}

const NAV_LINKS = [
  { href: '#activities', label: '13 Activities' },
  { href: '#coordinators', label: 'Coordinators' },
  { href: '#schedule', label: 'Daytime Schedule' },
  { href: '#lineup', label: 'Highlights' },
  { href: '#dresscode', label: 'Dress Code' },
  { href: '#rsvp', label: 'Entry Pass' },
];

export function Navbar({ hasIssuedPass, config = EVENT_CONFIG }: NavbarProps) {
  const cfg = config ?? EVENT_CONFIG;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-white/[0.08] transition-all">
      {/* Dynamic Gold Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F5A623] via-[#FFC04D] to-amber-200 origin-left"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Wordmark with Kishkinda University Logo & Synora Branding */}
        <a
          href="#top"
          className="group font-display text-lg sm:text-xl font-semibold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-[#F5A623] transition-colors flex items-center gap-2.5"
        >
          <img
            src="/kishkinda-logo.png"
            alt="Kishkinda University Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]"
          />
          <span className="font-extrabold text-white group-hover:text-[#F5A623] transition-colors">
            {cfg.brandName}
          </span>
          <span className="hidden xs:inline-block text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            {cfg.collegeName}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#F5A623] opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-zinc-300"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 hover:text-white transition-colors group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#F5A623] group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions (Google Form + Audio Vibe + Entry Pass + Menu) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <AudioVibeToggle />

          {/* Direct Google Form Button (High-Priority Primary Conversion) */}
          <motion.a
            href="#activities"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#09090B] bg-[#F5A623] hover:bg-[#FFC04D] shadow-[0_0_15px_rgba(245,166,35,0.25)] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#09090B]" />
            <span>Google Form</span>
          </motion.a>

          {/* Desktop/Tablet Claim Pass Button */}
          <motion.a
            href="#rsvp"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all whitespace-nowrap shrink-0"
          >
            {hasIssuedPass ? 'View Pass' : 'Entry Pass'}
          </motion.a>

          {/* Mobile compact Action button */}
          <motion.a
            href="#activities"
            whileTap={{ scale: 0.95 }}
            aria-label="Register on Google Form"
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg bg-[#F5A623] text-[#09090B] font-bold text-xs shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </motion.a>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-zinc-200 hover:bg-white/5 active:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Full-width Responsive Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-t border-white/[0.08] bg-[#09090B]/98 backdrop-blur-xl px-4 py-5 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <img
                  src="/kishkinda-logo.png"
                  alt="Kishkinda University"
                  className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]"
                />
                <div>
                  <span className="text-xs font-semibold text-amber-300 block">
                    {cfg.brandName}
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    {cfg.collegeName} · {cfg.department}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-300">
                26–30 Batch
              </span>
            </div>

            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    const targetId = link.href.replace('#', '');
                    // Small delay to let drawer close animation start before scrolling
                    setTimeout(() => {
                      const el = document.getElementById(targetId);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Update URL hash without triggering hashchange navigation
                        window.history.pushState(null, '', link.href);
                      }
                    }, 100);
                  }}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-zinc-500 font-mono">→</span>
                </a>
              ))}
            </nav>

            <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2">
              <a
                href="#activities"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  setTimeout(() => {
                    document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.pushState(null, '', '#activities');
                  }, 100);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F5A623] text-[#09090B] font-bold text-sm shadow-[0_0_15px_rgba(245,166,35,0.3)] text-center"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#09090B]" />
                <span>Register for 13 Activities (Google Form)</span>
              </a>

              <a
                href="#rsvp"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  setTimeout(() => {
                    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.pushState(null, '', '#rsvp');
                  }, 100);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-200 hover:text-white font-medium text-sm text-center"
              >
                <Ticket className="w-4 h-4 text-[#F5A623]" />
                <span>{hasIssuedPass ? 'View Digital Entry Pass' : 'Claim Entry Pass'}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
