import { motion } from 'motion/react';
import { Trophy, Sparkles, Gamepad2, Palette, ShieldCheck } from 'lucide-react';
import { HIGHLIGHT_ITEMS, type HighlightItem } from '../data/eventData';
import { ResilientImage } from './ResilientImage';

interface HighlightsBentoProps {
  highlights?: HighlightItem[];
}

export function HighlightsBento({ highlights = HIGHLIGHT_ITEMS }: HighlightsBentoProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section
      id="lineup"
      className="scroll-mt-20 py-12 sm:py-16 lg:py-24 border-b border-white/[0.08] relative"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10"
        >
          <div className="max-w-xl">
            <p className="text-sm text-[#F5A623] font-medium mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Daytime Fest Highlights</span>
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
              Signature arenas built for the{' '}
              <span className="text-gold-shimmer">26–30 Batch.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
            From the spotlight stage in the main auditorium to the turf battlegrounds—every
            segment is coordinated by AIML &amp; AIDS seniors for your unforgettable welcome.
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {highlights.map((item, idx) => {
            const isWide = item.colSpan === 2;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                className={`${
                  isWide ? 'lg:col-span-2' : ''
                } group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/40 bg-[#121216] min-h-[300px] sm:min-h-[360px] flex flex-col justify-end transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]`}
              >
                {item.image ? (
                  <ResilientImage
                    src={item.image}
                    alt={item.title}
                    fallbackTitle={item.fallbackTitle || item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-[#16161C] to-[#09090B]" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/95 via-[#09090B]/70 to-[#09090B]/10" />

                <div className={`relative z-10 p-5 ${isWide ? 'sm:p-8 max-w-xl' : 'sm:p-6'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-zinc-200 font-mono tabular-nums">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300 font-sans font-medium flex items-center gap-1">
                        {item.badgeCategory === 'stage' && <Trophy className="w-3 h-3 text-[#F5A623]" />}
                        {item.badgeCategory === 'sports' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                        {item.badgeCategory === 'gaming' && <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />}
                        {item.badgeCategory === 'creative' && <Palette className="w-3.5 h-3.5 text-pink-400" />}
                        {item.badge}
                      </span>
                      <span>{item.timeAndVenue}</span>
                    </div>

                    {item.hasEqualizer && (
                      <div className="flex items-end gap-1 h-3.5 sm:h-4 px-2 py-1 bg-black/50 backdrop-blur-md rounded border border-white/10 shrink-0">
                        <span className="w-1 bg-[#F5A623] rounded-full animate-[bounce_0.6s_infinite] h-2.5 sm:h-3" />
                        <span className="w-1 bg-[#FFC04D] rounded-full animate-[bounce_0.8s_infinite_0.15s] h-3.5 sm:h-4" />
                        <span className="w-1 bg-[#F5A623] rounded-full animate-[bounce_0.5s_infinite_0.3s] h-2 sm:h-2.5" />
                        <span className="w-1 bg-amber-200 rounded-full animate-[bounce_0.7s_infinite_0.2s] h-3 sm:h-3.5" />
                      </div>
                    )}
                  </div>

                  <h3 className={`font-display ${isWide ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl'} font-semibold text-white mb-2 group-hover:text-amber-200 transition-colors`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs ${isWide ? 'sm:text-sm lg:text-base text-zinc-200' : 'sm:text-sm text-zinc-300'} leading-relaxed`}>
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
