import { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DRESS_CODE_GUIDELINES,
  EVENT_CONFIG,
  EVENT_IMAGES,
  FAQ_ITEMS,
} from '../data/eventData';
import { ResilientImage } from './ResilientImage';

export function ShowcaseSection() {
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);

  return (
    <section
      id="dresscode"
      className="scroll-mt-20 py-12 sm:py-16 lg:py-24 border-b border-white/[0.08] relative"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Dress Code Lookbook Photo & Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5"
        >
          <p className="text-sm text-[#F5A623] font-medium mb-1.5 sm:mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Daytime Dress Code</span>
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-3 sm:mb-4">
            Smart Casuals &amp; <span className="text-gold-shimmer">Traditional Wear</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5 sm:mb-6">
            Comfortable, vibrant styles built for high daytime energy, outdoor sports
            cheering, and radiant stage photographs at the Auditorium.
          </p>

          <div className="group relative rounded-2xl overflow-hidden border border-white/[0.12] hover:border-amber-500/40 bg-[#121216] aspect-[4/3] sm:aspect-[3/4] max-h-[360px] sm:max-h-[420px] w-full mb-6 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
            <ResilientImage
              src={EVENT_IMAGES.dressCodeLookbook}
              alt="AIML and AIDS students in smart daytime festive and ethnic attire at Kishkinda University"
              fallbackTitle="Synora 2K26 Lookbook"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/85 via-transparent to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-xs text-zinc-200 flex items-center justify-between bg-black/50 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
              <span className="font-medium text-[11px] sm:text-xs">Ethnic &amp; Smart Festive</span>
              <span className="font-mono text-amber-300 text-[11px] sm:text-xs">Daytime Gala</span>
            </div>
          </div>

          <dl className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {DRESS_CODE_GUIDELINES.map((item) => (
              <div
                key={item.heading}
                className="py-3 sm:py-3.5 grid grid-cols-12 gap-2 sm:gap-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
              >
                <dt className="col-span-4 text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] shrink-0" />
                  <span className="truncate">{item.heading}</span>
                </dt>
                <dd className="col-span-8 text-xs text-zinc-400 leading-relaxed">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Right Column: Venue & Logistics FAQ */}
        <motion.div
          id="venue"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="scroll-mt-20 lg:col-span-7 rounded-2xl border border-white/[0.12] bg-[#121216] p-5 sm:p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <p className="text-sm text-[#F5A623] font-medium mb-1.5 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Venue &amp; FAQ</span>
          </p>
          <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-1.5">
            {EVENT_CONFIG.venueShort} · {EVENT_CONFIG.collegeName}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6">{EVENT_CONFIG.venueFull}</p>

          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${faq.id}`}
                    className="w-full py-4 flex items-center justify-between gap-3 text-left text-xs sm:text-sm font-medium text-white hover:text-[#F5A623] transition-colors cursor-pointer"
                  >
                    <span className="pr-2">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-zinc-400" aria-hidden="true" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${faq.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 text-xs sm:text-sm text-zinc-400 leading-relaxed pl-3 border-l-2 border-[#F5A623]/40 ml-1">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
