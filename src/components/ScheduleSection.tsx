import { useState } from 'react';
import { Bookmark, Check, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SCHEDULE_ITEMS, EVENT_CONFIG, type ScheduleItem, type EventConfigType } from '../data/eventData';
import { filterSchedule, type ScheduleFilter } from '../utils/partyLogic';

interface ScheduleSectionProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
  scheduleItems?: ScheduleItem[];
  config?: EventConfigType;
}

const FILTERS: { id: ScheduleFilter; label: string }[] = [
  { id: 'all', label: 'Full Timeline' },
  { id: 'stage', label: 'Auditorium Stage' },
  { id: 'sports', label: 'Sports & Arena' },
  { id: 'creative', label: 'Creative & Esports' },
  { id: 'dining', label: 'Lunch Feast' },
  { id: 'saved', label: 'My Plan' },
];

export function ScheduleSection({
  savedIds,
  onToggleSave,
  scheduleItems = SCHEDULE_ITEMS,
  config = EVENT_CONFIG,
}: ScheduleSectionProps) {
  const items = scheduleItems ?? SCHEDULE_ITEMS;
  const cfg = config ?? EVENT_CONFIG;
  const [activeFilter, setActiveFilter] = useState<ScheduleFilter>('all');

  const visibleItems = filterSchedule(items, activeFilter, savedIds);

  return (
    <section
      id="schedule"
      className="scroll-mt-20 py-12 sm:py-16 lg:py-24 border-b border-white/[0.08] bg-[#0C0C10] relative"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <p className="text-sm text-[#F5A623] font-medium mb-1.5 sm:mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Official Daytime Schedule</span>
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
              From {cfg.timeDisplay.split(' ')[0] ?? '09:30 AM'} to {cfg.timeDisplay.split('– ')[1]?.split(' ')[0] ?? '04:30 PM'},{' '}
              <span className="text-gold-shimmer">non-stop excitement.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg">
              {cfg.venueFull} · {cfg.batchLabel}
            </p>
          </div>

          {/* Interactive animated segmented filter controls (Swipeable on mobile) */}
          <div
            role="group"
            aria-label="Filter daytime schedule"
            className="flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1 p-1 rounded-xl bg-[#16161C] border border-white/[0.08] w-full sm:w-auto shadow-inner"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              const label =
                filter.id === 'saved'
                  ? `My Plan (${savedIds.length})`
                  : filter.label;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={isActive}
                  className={`relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 z-10 cursor-pointer ${
                    isActive
                      ? 'text-[#09090B] font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="scheduleTab"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#F5A623] to-[#FFC04D] rounded-lg -z-10 shadow-[0_2px_12px_rgba(245,166,35,0.35)]"
                    />
                  )}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chronological Schedule Rows */}
        {visibleItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/[0.08] bg-[#121216] p-8 sm:p-10 text-center"
          >
            <p className="text-base font-medium text-white mb-2">
              Your personal itinerary is empty.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 mb-5 max-w-md mx-auto">
              Bookmark any session from the full timeline to keep your favorite
              sports matches, stage performances, and lunch slot handy.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-[#09090B] bg-[#F5A623] hover:bg-[#FFC04D] rounded-lg transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(245,166,35,0.25)] cursor-pointer"
            >
              Browse Full Timeline
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, index) => {
                const isSaved = savedIds.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index * 0.04, 0.25),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative rounded-xl border border-white/[0.08] hover:border-amber-500/30 bg-[#121216] p-4 sm:p-6 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left: Time and category metadata */}
                      <div className="flex items-start gap-4">
                        <div className="w-20 sm:w-24 shrink-0">
                          <span className="block font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {item.time}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 mt-0.5">
                            <Clock className="w-3 h-3 text-[#F5A623]" />
                            {item.duration}
                          </span>
                        </div>

                        {/* Title, description, and location */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 border border-white/10 text-[#F5A623]">
                              {item.categoryLabel}
                            </span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              {item.location}
                            </span>
                          </div>

                          <h3 className="font-display text-base sm:text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                            {item.description}
                          </p>

                          {item.lead && (
                            <p className="text-xs text-zinc-400 pt-1 font-mono">
                              Coordination: <span className="text-zinc-200">{item.lead}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Bookmark / Save Action */}
                      <div className="self-end md:self-start shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleSave(item.id)}
                          aria-label={isSaved ? `Remove ${item.title} from plan` : `Save ${item.title} to plan`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#F5A623]'
                              : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save to Plan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
