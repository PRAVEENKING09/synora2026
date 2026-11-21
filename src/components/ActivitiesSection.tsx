import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  Phone,
  MessageCircle,
  Trophy,
  Users,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ACTIVITIES,
  EVENT_CONFIG,
  type ActivityCategory,
  type ActivityItem,
  type EventConfigType,
} from '../data/eventData';

interface ActivitiesSectionProps {
  activities?: ActivityItem[];
  config?: EventConfigType;
  googleFormUrl?: string;
  onUpdateGoogleFormUrl?: (url: string) => void;
}

export function ActivitiesSection({
  activities = ACTIVITIES,
  config = EVENT_CONFIG,
  googleFormUrl,
  onUpdateGoogleFormUrl,
}: ActivitiesSectionProps) {
  const activitiesList = activities ?? ACTIVITIES;
  const cfg = config ?? EVENT_CONFIG;
  const effectiveFormUrl = googleFormUrl || cfg.googleFormUrl;

  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [customFormUrl, setCustomFormUrl] = useState(effectiveFormUrl);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeActivityForRegistration, setActiveActivityForRegistration] =
    useState<ActivityItem | null>(null);

  // Keep customFormUrl in sync if prop changes
  useEffect(() => {
    setCustomFormUrl(effectiveFormUrl);
  }, [effectiveFormUrl]);

  const categoriesWithCounts = useMemo(() => {
    return [
      { id: 'All' as ActivityCategory, label: 'All Activities', count: activitiesList.length },
      {
        id: 'Sports' as ActivityCategory,
        label: 'Sports',
        count: activitiesList.filter((a) => a.category === 'Sports').length,
      },
      {
        id: 'Cultural' as ActivityCategory,
        label: 'Cultural & Stage',
        count: activitiesList.filter((a) => a.category === 'Cultural').length,
      },
      {
        id: 'Creative' as ActivityCategory,
        label: 'Creative & Media',
        count: activitiesList.filter((a) => a.category === 'Creative').length,
      },
      {
        id: 'Gaming & Intellect' as ActivityCategory,
        label: 'Gaming & Intellect',
        count: activitiesList.filter((a) => a.category === 'Gaming & Intellect').length,
      },
    ];
  }, [activitiesList]);

  const toggleRules = (id: string) => {
    setExpandedRules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activitiesList.filter((act) => {
      const matchCat =
        selectedCategory === 'All' ? true : act.category === selectedCategory;
      const matchQuery =
        !q ||
        act.title.toLowerCase().includes(q) ||
        act.coordinatorName.toLowerCase().includes(q) ||
        act.contactNumber.replace(/\s+/g, '').includes(q) ||
        act.category.toLowerCase().includes(q) ||
        act.venue.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [activitiesList, selectedCategory, searchQuery]);

  const handleOpenGoogleForm = (activity?: ActivityItem) => {
    setActiveActivityForRegistration(activity ?? null);
    setFormModalOpen(true);
  };

  const handleSaveFormUrl = () => {
    if (onUpdateGoogleFormUrl && customFormUrl.trim()) {
      onUpdateGoogleFormUrl(customFormUrl.trim());
    }
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(customFormUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section
      id="activities"
      className="scroll-mt-20 py-12 sm:py-16 lg:py-24 border-b border-white/[0.08] bg-[#09090B] relative"
    >
      {/* Background Solar Amber Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-[#F5A623]/8 rounded-full blur-[140px]"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-xs font-semibold text-[#F5A623] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FRESHERS' EVENT COORDINATOR LIST · SYNORA 2K26</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-3">
              13 Exciting Activities for the{' '}
              <span className="text-gold-shimmer">26–30 Batch.</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Explore all sports, cultural, creative, and gaming events happening during
              the daytime at {EVENT_CONFIG.collegeName} {EVENT_CONFIG.venueShort}.
              Connect with your senior coordinators and register via Google Forms!
            </p>
          </div>

          {/* Master Google Form Registration Banner / Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenGoogleForm()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#FFC04D] text-[#09090B] font-semibold text-sm shadow-[0_0_25px_rgba(245,166,35,0.3)] hover:shadow-[0_0_35px_rgba(245,166,35,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap text-center group cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#09090B]" />
              <span>Register via Google Form</span>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Quick Highlights / Callout Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#18181B] to-amber-500/5 border border-[#F5A623]/25 mb-8 sm:mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F5A623]/20 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                All 1st-Year AIML Students (Batch 2026–2030) are Eligible!
              </p>
              <p className="text-xs text-zinc-300">
                Participation certificates and championship trophies awarded during the
                Auditorium Valedictory Ceremony.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
              Auditorium Venue
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-amber-300">
              9:30 AM – 4:30 PM
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-emerald-400">
              Free Registration
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
          {/* Category Tabs */}
          <div
            role="group"
            aria-label="Filter activities by category"
            className="flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1 p-1 rounded-xl bg-[#16161C] border border-white/[0.08]"
          >
            {categoriesWithCounts.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={isActive}
                  className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 z-10 cursor-pointer ${
                    isActive
                      ? 'text-[#09090B] font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activityCatTab"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#F5A623] to-[#FFC04D] rounded-lg -z-10 shadow-[0_2px_10px_rgba(245,166,35,0.3)]"
                    />
                  )}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event, coordinator, phone..."
              className="w-full bg-[#16161C] border border-white/[0.08] focus:border-[#F5A623] rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Activities Grid */}
        {filteredActivities.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#121216] p-10 text-center">
            <p className="text-white font-medium text-base mb-1">
              No activities found matching "{searchQuery}".
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm mb-4">
              Try searching for "Cricket", "Dance", "Free Fire", or click below to reset.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F5A623] text-[#09090B]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredActivities.map((activity, idx) => {
              const isRulesOpen = expandedRules[activity.id] ?? false;
              const cleanPhone = activity.contactNumber.replace(/\s+/g, '');
              const waMessage = encodeURIComponent(
                `Hi ${activity.coordinatorName}, I am a 1st-year AIML student (Batch 2026–2030) at Kishkinda University. I'm inquiring about the "${activity.title}" event for Synora 2K26.`
              );
              const waUrl = `https://wa.me/${activity.contactRaw}?text=${waMessage}`;
              const telUrl = `tel:+${activity.contactRaw}`;

              return (
                <motion.article
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                  className="rounded-2xl border border-white/[0.08] hover:border-[#F5A623]/40 bg-[#121216] flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_35px_rgba(245,166,35,0.12)] group"
                >
                  {/* Card Header & Badges */}
                  <div className="p-5 sm:p-6 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-amber-300">
                          #{String(activity.slNo).padStart(2, '0')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-zinc-300">
                          {activity.category}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 flex items-center gap-1 font-medium">
                        <Flame className="w-3 h-3" />
                        {activity.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                      {activity.description}
                    </p>

                    {/* Metadata chips */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 font-mono mb-4 pt-1 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                        <span className="truncate">{activity.timing}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{activity.teamType}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5 truncate text-[11px] text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{activity.venue}</span>
                      </div>
                    </div>

                    {/* Collapsible Rules */}
                    <div className="border-t border-white/[0.06] pt-3">
                      <button
                        type="button"
                        onClick={() => toggleRules(activity.id)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-zinc-400 hover:text-white transition-colors py-1 cursor-pointer"
                      >
                        <span>Rules &amp; Guidelines ({activity.rules.length})</span>
                        {isRulesOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#F5A623]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isRulesOpen && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-2.5 space-y-1.5 text-xs text-zinc-300 pl-1 overflow-hidden"
                          >
                            {activity.rules.map((rule, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-1.5">
                                <span className="text-[#F5A623] mt-0.5">•</span>
                                <span className="leading-snug">{rule}</span>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Card Footer: Coordinator & Action Buttons */}
                  <div className="p-4 sm:p-5 bg-black/40 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                          Coordinator
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {activity.coordinatorName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                          Contact
                        </p>
                        <p className="text-xs font-mono font-medium text-amber-300">
                          {activity.contactNumber}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2.5">
                      {/* WhatsApp Button */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 hover:text-emerald-200 text-xs font-semibold transition-all text-center"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Direct Call Button */}
                      <a
                        href={telUrl}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 hover:text-white text-xs font-semibold transition-all text-center"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0 text-[#F5A623]" />
                        <span>Call</span>
                      </a>
                    </div>

                    {/* Register for this event button */}
                    <button
                      type="button"
                      onClick={() => handleOpenGoogleForm(activity)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#F5A623] hover:bg-[#FFC04D] text-[#09090B] text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,166,35,0.2)] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Register on Google Form</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Coordinators Summary Table for Quick Reference */}
        <div
          id="coordinators"
          className="scroll-mt-24 mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#121216]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Coordinator Directory · Synora 2K26</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Official coordinator contact list for all 13 activities (AIML Department, Kishkinda University)
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenGoogleForm()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#F5A623] text-[#09090B] font-semibold text-xs shrink-0 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Open Google Form</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Sl. No.</th>
                  <th className="py-2.5 px-3">Event Name</th>
                  <th className="py-2.5 px-3">Coordinator</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3 text-right">Quick Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {activitiesList.map((act) => (
                  <tr key={act.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono text-amber-300 font-semibold">
                      {String(act.slNo).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {act.title}
                    </td>
                    <td className="py-3 px-3 text-zinc-300">
                      {act.coordinatorName}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-300">
                      {act.contactNumber}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <a
                          href={`tel:+${act.contactRaw}`}
                          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white transition-colors"
                          title={`Call ${act.coordinatorName}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-[#F5A623]" />
                        </a>
                        <a
                          href={`https://wa.me/${act.contactRaw}?text=${encodeURIComponent(
                            `Hi ${act.coordinatorName}, I am an AIML 1st year student inquiring about ${act.title}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition-colors"
                          title={`WhatsApp ${act.coordinatorName}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Google Form Modal */}
      <AnimatePresence>
        {formModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setFormModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#16161C] p-6 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#F5A623]/20 border border-[#F5A623]/30 flex items-center justify-center text-[#F5A623]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-white">
                    Official Activity Registration
                  </h4>
                  <p className="text-xs text-amber-300 font-medium">
                    Synora 2K26 · Kishkinda University
                  </p>
                </div>
              </div>

              {activeActivityForRegistration && (
                <div className="mt-3 p-3 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400 block">Selected Event:</span>
                    <span className="text-sm font-bold text-white">
                      {activeActivityForRegistration.title}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-zinc-400 block">Coordinator:</span>
                    <span className="text-xs font-semibold text-amber-300">
                      {activeActivityForRegistration.coordinatorName} ({activeActivityForRegistration.contactNumber})
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed">
                All 1st-year students from the AIML Department (Batch 2026–2030) must register
                for their chosen events using the official Google Form. You may participate in multiple
                events as long as timings do not clash.
              </p>

              {/* Instructions List */}
              <div className="mt-4 p-3.5 rounded-xl bg-black/30 border border-white/[0.06] space-y-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Enter your Full Name, Roll No. / USN, and AIML Section.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tick the boxes for the 13 events you wish to join.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>For team events (Cricket, Tug of War, Free Fire), list your squad members.</span>
                </div>
              </div>

              {/* Editable Form URL (for student coordinators / users to set their actual link) */}
              <div className="mt-5 space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Google Form URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customFormUrl}
                    onChange={(e) => setCustomFormUrl(e.target.value)}
                    placeholder="https://forms.google.com/..."
                    className="flex-1 bg-black/40 border border-white/10 focus:border-[#F5A623] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Launch Action */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={customFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    handleSaveFormUrl();
                    setFormModalOpen(false);
                  }}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#FFC04D] text-[#09090B] font-bold text-sm shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:shadow-[0_0_25px_rgba(245,166,35,0.5)] transition-all text-center"
                >
                  <span>Open Google Form Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
