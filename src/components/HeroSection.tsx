import { useEffect, useState } from 'react';
import { ArrowDownRight, Calendar, MapPin, Sparkles, FileSpreadsheet, Trophy, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { EVENT_CONFIG, EVENT_IMAGES, type EventConfigType } from '../data/eventData';
import { getCountdownParts, padTwo } from '../utils/partyLogic';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  hasIssuedPass: boolean;
  config?: EventConfigType;
}

export function HeroSection({ hasIssuedPass, config = EVENT_CONFIG }: HeroSectionProps) {
  const cfg = config ?? EVENT_CONFIG;
  const targetMs = new Date(cfg.eventStartIso).getTime();
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const countdown = getCountdownParts(targetMs, nowMs);

  return (
    <section id="top" className="relative border-b border-white/[0.08] bg-[#09090B] overflow-hidden">
      {/* Subtle Background Radial Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#F5A623]/10 rounded-full blur-[100px] sm:blur-[140px] animate-float-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-40 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-amber-500/5 rounded-full blur-[100px] sm:blur-[120px]"
      />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16">
        {/* 2-Column Split: Content on Left, Photo Frame on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Animated Content & Live Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between gap-6 sm:gap-8"
          >
            <div className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300"
              >
                <img
                  src="/kishkinda-logo.png"
                  alt="Kishkinda University Crest"
                  className="w-5 h-5 object-contain drop-shadow-[0_0_6px_rgba(245,166,35,0.4)]"
                />
                <span className="text-[#F5A623] font-semibold">
                  {cfg.collegeName}
                </span>
                <span aria-hidden="true" className="text-zinc-600 hidden xs:inline">·</span>
                <span className="text-zinc-200 font-medium">{cfg.department}</span>
                <span aria-hidden="true" className="text-zinc-600 hidden xs:inline">·</span>
                <span className="text-amber-300 font-mono">{cfg.batchLabel}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-display font-semibold tracking-tight text-white leading-[1.08]"
                style={{ fontSize: 'clamp(2.1rem, 6.4vw, 3.85rem)' }}
              >
                Welcome to <span className="text-gold-shimmer">{cfg.brandName}</span>
                <span className="block text-xl sm:text-2xl lg:text-3xl font-medium text-zinc-300 mt-2 font-sans">
                  AIML Department Freshers' Fest
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-sm sm:text-base leading-relaxed text-zinc-300 max-w-lg"
              >
                A high-energy daytime celebration curated by seniors for the incoming{' '}
                <span className="text-white font-medium">2026–2030 Batch</span> at the{' '}
                <span className="text-[#F5A623] font-medium">{cfg.collegeName} {cfg.venueShort}</span>.
                Explore all 13 activities, check rules &amp; timings, connect with senior
                coordinators, and register directly via Google Forms!
              </motion.p>
            </div>

            {/* CTAs: Google Form Register + Activities + Entry Pass */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <motion.a
                href="#activities"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 text-sm font-bold text-[#09090B] bg-[#F5A623] hover:bg-[#FFC04D] shadow-[0_0_25px_rgba(245,166,35,0.3)] hover:shadow-[0_0_35px_rgba(245,166,35,0.5)] rounded-xl transition-all whitespace-nowrap group text-center cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#09090B]" />
                <span>Register for Activities</span>
                <Sparkles className="w-4 h-4 opacity-70 group-hover:rotate-12 transition-transform" />
              </motion.a>

              <motion.a
                href="#rsvp"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 text-sm font-medium text-zinc-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-colors text-center"
              >
                <span>{hasIssuedPass ? 'View Entry Pass' : 'Claim Entry Pass'}</span>
                <ArrowDownRight className="w-4 h-4 text-[#F5A623]" />
              </motion.a>
            </motion.div>

            {/* Quick Stat Counter Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.08]"
            >
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                <span className="block text-base sm:text-lg font-bold text-white font-mono">13</span>
                <span className="block text-[11px] text-zinc-400">Events Open</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                <span className="block text-base sm:text-lg font-bold text-amber-300 font-mono">26–30</span>
                <span className="block text-[11px] text-zinc-400">1st Year Batch</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                <span className="block text-base sm:text-lg font-bold text-emerald-400 font-mono">Daytime</span>
                <span className="block text-[11px] text-zinc-400">Auditorium Fest</span>
              </div>
            </motion.div>

            {/* Live Countdown Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="pt-2"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="uppercase tracking-wider font-semibold text-[11px] text-[#F5A623] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-ping" />
                  Countdown to Inauguration
                </span>
                <span className="font-mono text-zinc-400">09:30 AM IST</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: 'Days', value: padTwo(countdown.days) },
                  { label: 'Hours', value: padTwo(countdown.hours) },
                  { label: 'Minutes', value: padTwo(countdown.minutes) },
                  { label: 'Seconds', value: padTwo(countdown.seconds) },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center min-w-[54px]"
                  >
                    <div className="font-mono text-lg sm:text-2xl font-bold text-white tracking-tight">
                      {countdown.isLive ? 'LIVE' : item.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Photo Frame & Event Meta Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between gap-4"
          >
            {/* Visual Marquee Hero Frame */}
            <div className="group relative w-full h-[260px] sm:h-[340px] lg:h-[400px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <ResilientImage
                src={EVENT_IMAGES.heroGala}
                alt="AIML Freshers Fest Celebration at Kishkinda University Auditorium"
                fallbackTitle="Synora 2K26 · Kishkinda University"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/40 to-transparent" />

              {/* Floating Live Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">Official Fest Portal</span>
              </div>

              {/* Bottom Overlay Label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#F5A623] text-xs font-mono font-semibold">
                    {cfg.venueShort} · {cfg.collegeName}
                  </span>
                  <p className="font-display text-lg sm:text-xl font-bold text-white mt-1.5">
                    {cfg.brandName} Daytime Gala
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-zinc-300 font-mono">
                    {cfg.timeDisplay}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadata Status Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 sm:p-5 rounded-2xl bg-[#121216] border border-white/[0.08]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[#F5A623]" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block">
                    Daytime Schedule
                  </span>
                  <span className="text-sm font-semibold text-white block mt-0.5">
                    {cfg.dateDisplay}
                  </span>
                  <span className="text-xs font-mono text-amber-300 block">
                    {cfg.timeDisplay}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#F5A623]" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block">
                    Official Venue
                  </span>
                  <span className="text-sm font-semibold text-white block mt-0.5">
                    {cfg.venueFull}
                  </span>
                  <span className="text-xs text-zinc-400 block">
                    Auditorium &amp; Adjacent Sports Arena
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
