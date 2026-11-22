import { motion } from 'motion/react';
import { ArrowUpRight, Trophy, Sparkles, Gamepad2, Palette, ShieldCheck } from 'lucide-react';
import { EVENT_CONFIG, EVENT_IMAGES } from '../data/eventData';
import { ResilientImage } from './ResilientImage';

export function HighlightsBento() {
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
              Four signature arenas built for the{' '}
              <span className="text-gold-shimmer">26–30 Batch.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
            From the spotlight stage in the main auditorium to the turf battlegrounds—every
            segment is coordinated by AIML seniors for your unforgettable welcome.
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: 2-column marquee card for Stage & Cultural Spotlight */}
          <motion.article
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/40 bg-[#121216] min-h-[320px] sm:min-h-[360px] flex flex-col justify-end transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          >
            <ResilientImage
              src={EVENT_IMAGES.stageSpotlight}
              alt="Grand Auditorium Stage with spotlights illuminating performers and ramp walk"
              fallbackTitle="01. Main Auditorium Stage"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/95 via-[#09090B]/70 to-[#09090B]/10" />

            <div className="relative z-10 p-5 sm:p-8 max-w-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-zinc-200 font-mono tabular-nums">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300 font-sans font-medium flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-[#F5A623]" />
                    Main Stage
                  </span>
                  <span>02:00 PM – 04:30 PM</span>
                  <span aria-hidden="true" className="hidden xs:inline">·</span>
                  <span className="truncate">{EVENT_CONFIG.venueShort}</span>
                </div>

                {/* Animated visual EQ bar */}
                <div className="flex items-end gap-1 h-3.5 sm:h-4 px-2 py-1 bg-black/50 backdrop-blur-md rounded border border-white/10 shrink-0">
                  <span className="w-1 bg-[#F5A623] rounded-full animate-[bounce_0.6s_infinite] h-2.5 sm:h-3" />
                  <span className="w-1 bg-[#FFC04D] rounded-full animate-[bounce_0.8s_infinite_0.15s] h-3.5 sm:h-4" />
                  <span className="w-1 bg-[#F5A623] rounded-full animate-[bounce_0.5s_infinite_0.3s] h-2 sm:h-2.5" />
                  <span className="w-1 bg-amber-200 rounded-full animate-[bounce_0.7s_infinite_0.2s] h-3 sm:h-3.5" />
                </div>
              </div>

              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-2 group-hover:text-amber-200 transition-colors">
                01. Grand Stage: Ramp Walk &amp; 3 Stage Showdown
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-zinc-200 leading-relaxed">
                Step into the spotlight runway to compete for Mr. &amp; Ms. Synora, showcase
                your theatrical mono act or dance routine, and battle in the high-stakes 3 Stage
                Showdown judged live by faculty and seniors.
              </p>
            </div>
          </motion.article>

          {/* Card 2: 1-column Sports & Arena Battles */}
          <motion.article
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/40 bg-[#121216] min-h-[300px] sm:min-h-[360px] flex flex-col justify-end transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          >
            <ResilientImage
              src={EVENT_IMAGES.heroGala}
              alt="Exciting sports and competitive arena at Kishkinda University"
              fallbackTitle="02. Outdoor Sports Arenas"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/95 via-[#09090B]/70 to-[#09090B]/10" />

            <div className="relative z-10 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono mb-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans font-medium">
                  Outdoor Arenas
                </span>
                <span>10:15 AM – 12:45 PM</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-1.5 group-hover:text-amber-200 transition-colors">
                02. Box Cricket &amp; Tug of War
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Inter-section cricket thrills on the campus turf and adrenaline-fueled rope
                pulling on the central lawn. Rally your section squad for glory!
              </p>
            </div>
          </motion.article>

          {/* Card 3: 1-column Esports & Gaming Clash */}
          <motion.article
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/40 bg-[#121216] min-h-[300px] sm:min-h-[360px] flex flex-col justify-end transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          >
            <ResilientImage
              src={EVENT_IMAGES.esportsGaming}
              alt="Exciting esports gaming arena with neon-lit screens and competitive gamers"
              fallbackTitle="03. Esports & Gaming Arena"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/95 via-[#09090B]/70 to-[#09090B]/10" />

            <div className="relative z-10 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono mb-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-sans font-medium flex items-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Esports &amp; Intellect
                </span>
                <span>10:30 AM</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-1.5 group-hover:text-amber-200 transition-colors">
                03. Free Fire, Mind Games &amp; Hidden Chapters
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Custom room battle royale squad skirmishes, live logic buzzer rounds, and
                a campus-wide treasure hunt designed to test sharp algorithmic intellect.
              </p>
            </div>
          </motion.article>

          {/* Card 4: 2-column Creative Media & Arts Studio */}
          <motion.article
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-amber-500/40 bg-[#121216] min-h-[300px] sm:min-h-[360px] flex flex-col justify-end transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          >
            <ResilientImage
              src={EVENT_IMAGES.creativeArts}
              alt="Creative arts studio with cameras, paint palettes, and reel-making setup"
              fallbackTitle="04. Creative Arts & Media"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/95 via-[#09090B]/70 to-[#09090B]/10" />

            <div className="relative z-10 p-5 sm:p-8 max-w-xl">
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono mb-2">
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-sans font-medium flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" />
                  Creative &amp; Fine Arts
                </span>
                <span>All-Day Submissions</span>
                <span aria-hidden="true">·</span>
                <span>Auditorium Foyer</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-2 group-hover:text-amber-200 transition-colors">
                04. Photography, Reel Making &amp; Painting
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-zinc-200 leading-relaxed">
                Capture the lively daytime memories through candid photography, direct an
                aesthetic trending Instagram reel, or express your imagination on canvas.
                Trophies and recognition await the most creative minds!
              </p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
