import { ArrowUp, Sparkles, Phone, MessageCircle, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { COORDINATORS, EVENT_CONFIG, type EventConfigType, type ActivityItem } from '../data/eventData';

interface FooterProps {
  config?: EventConfigType;
  activities?: ActivityItem[];
}

export function Footer({ config = EVENT_CONFIG, activities }: FooterProps) {
  const cfg = config ?? EVENT_CONFIG;
  const coordList = activities
    ? activities.map((a) => ({
        event: a.title,
        name: a.coordinatorName,
        contact: a.contactNumber,
        rawPhone: a.contactRaw,
      }))
    : COORDINATORS;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#09090B] py-10 sm:py-14 border-t border-white/[0.08] z-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-8 sm:pb-10 border-b border-white/[0.08]">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <a
              href="#top"
              className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white inline-flex items-center gap-2.5 hover:text-[#F5A623] transition-colors"
            >
              <img
                src="/kishkinda-logo.png"
                alt="Kishkinda University"
                className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]"
              />
              <span>{cfg.brandName}</span>
              <Sparkles className="w-4 h-4 text-[#F5A623]" />
            </a>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Official freshers&apos; festival portal hosted by the {cfg.department},{' '}
              <span className="text-white font-medium">{cfg.collegeName}</span> to
              welcome the incoming {cfg.batchLabel}.
            </p>
            <div className="space-y-1 text-xs font-mono text-zinc-400">
              <p className="text-[#F5A623]">{cfg.timeDisplay}</p>
              <p>{cfg.venueFull}</p>
            </div>

            <div className="pt-2">
              <a
                href="#activities"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F5A623] text-[#09090B] text-xs font-bold shadow-[0_0_15px_rgba(245,166,35,0.25)] hover:bg-[#FFC04D] transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Register on Google Form</span>
              </a>
            </div>
          </div>

          {/* 13 Coordinators Directory preview */}
          <div className="md:col-span-5">
            <h3 className="text-xs font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider flex items-center justify-between">
              <span>Event Coordinators ({coordList.length} Activities)</span>
              <a href="#coordinators" className="text-[11px] text-[#F5A623] hover:underline normal-case">
                View All →
              </a>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
              {coordList.slice(0, 8).map((coord) => (
                <div
                  key={coord.event}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs"
                >
                  <div className="text-white font-semibold flex items-center justify-between">
                    <span className="truncate pr-1">{coord.name}</span>
                    <span className="text-[10px] text-amber-300 font-mono truncate">
                      {coord.event}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5 flex items-center justify-between">
                    <span>{coord.contact}</span>
                    <a
                      href={`tel:+${coord.rawPhone}`}
                      className="text-[#F5A623] hover:underline"
                    >
                      Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links & Back to Top */}
          <div className="md:col-span-3 flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-xs font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider">
                Quick Navigation
              </h3>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 text-xs sm:text-sm text-zinc-400">
                <li>
                  <a href="#activities" className="hover:text-[#F5A623] transition-colors py-0.5 inline-block">
                    13 Activities
                  </a>
                </li>
                <li>
                  <a href="#coordinators" className="hover:text-[#F5A623] transition-colors py-0.5 inline-block">
                    Coordinator List
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="hover:text-[#F5A623] transition-colors py-0.5 inline-block">
                    Daytime Schedule
                  </a>
                </li>
                <li>
                  <a href="#dresscode" className="hover:text-[#F5A623] transition-colors py-0.5 inline-block">
                    Dress Code Lookbook
                  </a>
                </li>
                <li>
                  <a href="#spotlight" className="hover:text-[#F5A623] transition-colors py-0.5 inline-block">
                    Stage Playlist
                  </a>
                </li>
                <li>
                  <a href="#rsvp" className="hover:text-[#F5A623] transition-colors py-0.5 inline-block">
                    Entry Pass
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 text-xs font-medium text-zinc-300 hover:text-white transition-all w-full sm:w-auto justify-center cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Back to top</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] sm:text-xs text-zinc-400 border-b border-white/[0.04] pb-5">
          <p>
            © 2026 {cfg.collegeName} · {cfg.department} · {cfg.batchLabel}.
          </p>
          <p>{cfg.venueFull}</p>
        </div>

        {/* Developed by AnosinX Studios Credit */}
        <div className="pt-4 pb-1 flex items-center justify-center text-center text-xs text-zinc-400">
          <p className="inline-flex items-center gap-1.5 flex-wrap justify-center">
            <span>Developed by</span>
            <a
              href="https://anosinx.store/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-[#F5A623] transition-colors underline decoration-[#F5A623]/50 hover:decoration-[#F5A623] underline-offset-4 inline-flex items-center gap-1 group"
            >
              <span>AnosinX Studios</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#F5A623] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
