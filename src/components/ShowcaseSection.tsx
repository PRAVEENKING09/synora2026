import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  ThumbsUp,
  Music,
  Mic2,
  Sparkles,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DRESS_CODE_GUIDELINES,
  EVENT_CONFIG,
  EVENT_IMAGES,
  FAQ_ITEMS,
  type SongRequest,
  type TalentCategory,
  type TalentEntry,
} from '../data/eventData';
import {
  validateSongRequest,
  validateTalentSubmission,
  type SongValidationErrors,
  type TalentValidationErrors,
} from '../utils/partyLogic';
import { ResilientImage } from './ResilientImage';

interface ShowcaseSectionProps {
  songs: SongRequest[];
  votedSongIds: string[];
  onToggleSongVote: (songId: string) => void;
  onAddSong: (title: string, artist: string, requestedBy: string) => void;
  talentEntries: TalentEntry[];
  onAddTalent: (entry: {
    name: string;
    rollNumber: string;
    category: TalentCategory;
    pitch: string;
  }) => void;
}

const TALENT_CATEGORIES: TalentCategory[] = [
  'Ramp Walk (Mr. & Ms. Synora)',
  'Solo / Duet Dance',
  'Mono Act / Dramatics',
  '3 Stage Showdown',
  'Acoustic / Stage Music',
];

export function ShowcaseSection({
  songs,
  votedSongIds,
  onToggleSongVote,
  onAddSong,
  talentEntries,
  onAddTalent,
}: ShowcaseSectionProps) {
  const [activeTab, setActiveTab] = useState<'songs' | 'talent'>('songs');
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);

  // Song request form state
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songRequester, setSongRequester] = useState('');
  const [songErrors, setSongErrors] = useState<SongValidationErrors>({});
  const [songSuccess, setSongSuccess] = useState<string | null>(null);

  // Talent audition form state
  const [talentName, setTalentName] = useState('');
  const [talentRoll, setTalentRoll] = useState('');
  const [talentCategory, setTalentCategory] =
    useState<TalentCategory>('Ramp Walk (Mr. & Ms. Synora)');
  const [talentPitch, setTalentPitch] = useState('');
  const [talentErrors, setTalentErrors] = useState<TalentValidationErrors>({});
  const [talentSuccess, setTalentSuccess] = useState<string | null>(null);

  const handleSongSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSongSuccess(null);
    const errors = validateSongRequest(
      { title: songTitle, artist: songArtist, requestedBy: songRequester },
      songs
    );
    setSongErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onAddSong(songTitle, songArtist, songRequester);
    setSongSuccess(`Added "${songTitle.trim()}" to the Auditorium stage queue.`);
    setSongTitle('');
    setSongArtist('');
    setSongRequester('');
  };

  const handleTalentSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTalentSuccess(null);
    const errors = validateTalentSubmission({
      name: talentName,
      rollNumber: talentRoll,
      category: talentCategory,
      pitch: talentPitch,
    });
    setTalentErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onAddTalent({
      name: talentName,
      rollNumber: talentRoll,
      category: talentCategory,
      pitch: talentPitch,
    });
    setTalentSuccess(
      `Slot reserved for ${talentName.trim()} (${talentCategory}).`
    );
    setTalentName('');
    setTalentRoll('');
    setTalentPitch('');
  };

  return (
    <section
      id="dresscode"
      className="scroll-mt-20 py-12 sm:py-16 lg:py-24 border-b border-white/[0.08] relative"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Dress Code Lookbook Photo & Venue Logistics FAQ */}
        <div className="lg:col-span-5 space-y-8 sm:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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
                <div key={item.heading} className="py-3 sm:py-3.5 grid grid-cols-12 gap-2 sm:gap-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
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

          {/* Venue & Logistics Accordion */}
          <div id="venue" className="scroll-mt-20 pt-2">
            <p className="text-sm text-[#F5A623] font-medium mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Venue &amp; FAQ</span>
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-1.5">
              {EVENT_CONFIG.venueShort} · {EVENT_CONFIG.collegeName}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-5">{EVENT_CONFIG.venueFull}</p>

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
                      className="w-full py-3.5 sm:py-4 flex items-center justify-between gap-3 text-left text-xs sm:text-sm font-medium text-white hover:text-[#F5A623] transition-colors cursor-pointer"
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
                          <div className="pb-4 text-xs sm:text-sm text-zinc-400 leading-relaxed pl-2 border-l-2 border-[#F5A623]/40 ml-1">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Stage Tracks & Spotlight Registrations */}
        <motion.div
          id="spotlight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="scroll-mt-20 lg:col-span-7 rounded-2xl border border-white/[0.12] bg-[#121216] p-4 sm:p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <div className="flex flex-col gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-white/[0.08]">
            <div>
              <p className="text-sm text-[#F5A623] font-medium mb-1 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#F5A623]" />
                <span>Auditorium Stage Hub</span>
              </p>
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white">
                Queue tracks &amp; sign up for{' '}
                <span className="text-gold-shimmer">the stage.</span>
              </h2>
            </div>

            {/* Smooth sliding tab switcher */}
            <div
              role="tablist"
              aria-label="Participation hub tabs"
              className="relative grid grid-cols-2 sm:inline-flex items-center gap-1 p-1 rounded-xl bg-[#09090B] border border-white/[0.08] w-full sm:w-auto"
            >
              <button
                type="button"
                role="tab"
                id="tab-songs"
                aria-selected={activeTab === 'songs'}
                aria-controls="panel-songs"
                onClick={() => setActiveTab('songs')}
                className={`relative px-2 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 z-10 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'songs'
                    ? 'text-[#09090B] font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {activeTab === 'songs' && (
                  <motion.div
                    layoutId="participationTab"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#F5A623] to-[#FFC04D] rounded-lg -z-10 shadow-[0_2px_12px_rgba(245,166,35,0.35)]"
                  />
                )}
                <Music className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Stage Playlist ({songs.length})</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-talent"
                aria-selected={activeTab === 'talent'}
                aria-controls="panel-talent"
                onClick={() => setActiveTab('talent')}
                className={`relative px-2 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 z-10 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'talent'
                    ? 'text-[#09090B] font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {activeTab === 'talent' && (
                  <motion.div
                    layoutId="participationTab"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#F5A623] to-[#FFC04D] rounded-lg -z-10 shadow-[0_2px_12px_rgba(245,166,35,0.35)]"
                  />
                )}
                <Mic2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Stage Spots ({talentEntries.length})</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'songs' ? (
              <motion.div
                key="songs-panel"
                id="panel-songs"
                role="tabpanel"
                aria-labelledby="tab-songs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="pt-5 sm:pt-6 space-y-6 sm:space-y-8"
              >
                <div>
                  <p className="text-xs sm:text-sm text-zinc-400 mb-4">
                    Top-voted tracks play through the Auditorium sound system during lunch,
                    sports cheering, and stage intermissions. Upvote your favorites!
                  </p>

                  <ul
                    data-testid="song-queue-list"
                    className="divide-y divide-white/[0.08] border-y border-white/[0.08]"
                  >
                    {songs.map((song, idx) => {
                      const hasVoted = votedSongIds.includes(song.id);
                      const isTopTrack = idx === 0;
                      return (
                        <li
                          key={song.id}
                          className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                            <span className="font-mono tabular-nums text-xs text-zinc-500 w-4 sm:w-5 shrink-0 text-center font-bold">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="text-sm sm:text-base font-medium text-white truncate group-hover:text-amber-200 transition-colors">
                                  {song.title}
                                </span>
                                {isTopTrack && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold bg-amber-500/20 text-[#F5A623] border border-amber-500/30 shrink-0">
                                    <Flame className="w-2.5 h-2.5" /> Top
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] sm:text-xs text-zinc-400 flex flex-wrap items-center gap-x-1.5 truncate">
                                <span className="truncate">{song.artist}</span>
                                <span aria-hidden="true" className="text-zinc-600">·</span>
                                <span className="text-zinc-500 truncate">{song.requestedBy}</span>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.88 }}
                            onClick={() => onToggleSongVote(song.id)}
                            aria-pressed={hasVoted}
                            aria-label={`${hasVoted ? 'Remove vote for' : 'Upvote'} ${song.title} by ${song.artist}`}
                            className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs font-mono tabular-nums rounded-lg border transition-all whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer ${
                              hasVoted
                                ? 'bg-[#F5A623]/20 border-[#F5A623]/60 text-[#F5A623] shadow-[0_0_12px_rgba(245,166,35,0.25)]'
                                : 'bg-transparent border-white/15 text-zinc-300 hover:border-amber-500/40 hover:text-white'
                            }`}
                          >
                            <ThumbsUp
                              className={`w-3.5 h-3.5 transition-transform ${
                                hasVoted ? 'scale-110 fill-[#F5A623]' : ''
                              }`}
                              aria-hidden="true"
                            />
                            <span className="font-semibold">{song.votes}</span>
                          </motion.button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Add Song Form */}
                <form onSubmit={handleSongSubmit} noValidate className="space-y-4 pt-2">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#F5A623]" />
                    <span>Request an Auditorium Track</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label
                        htmlFor="song-title"
                        className="block text-xs font-medium text-zinc-300 mb-1.5"
                      >
                        Song Title
                      </label>
                      <input
                        id="song-title"
                        type="text"
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                        placeholder="e.g. Tauba Tauba"
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
                      />
                      {songErrors.title && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{songErrors.title}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="song-artist"
                        className="block text-xs font-medium text-zinc-300 mb-1.5"
                      >
                        Artist
                      </label>
                      <input
                        id="song-artist"
                        type="text"
                        value={songArtist}
                        onChange={(e) => setSongArtist(e.target.value)}
                        placeholder="e.g. Karan Aujla"
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
                      />
                      {songErrors.artist && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{songErrors.artist}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="song-requester"
                        className="block text-xs font-medium text-zinc-300 mb-1.5"
                      >
                        Your Name / Section (Batch 2026–2030)
                      </label>
                      <input
                        id="song-requester"
                        type="text"
                        value={songRequester}
                        onChange={(e) => setSongRequester(e.target.value)}
                        placeholder="e.g. Rahul · 26AIML034 / 26AIDS018"
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-sm font-semibold text-[#09090B] bg-[#F5A623] hover:bg-[#FFC04D] rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-[0_0_15px_rgba(245,166,35,0.2)] text-center justify-center cursor-pointer"
                    >
                      Add to Stage Queue
                    </motion.button>
                  </div>

                  {songSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="status"
                      className="text-xs text-emerald-400 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{songSuccess}</span>
                    </motion.p>
                  )}
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="talent-panel"
                id="panel-talent"
                role="tabpanel"
                aria-labelledby="tab-talent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="pt-5 sm:pt-6 space-y-6 sm:space-y-8"
              >
                <div>
                  <p className="text-xs sm:text-sm text-zinc-400 mb-4">
                    Step onto the Main Auditorium stage for Ramp Walk (Mr. &amp; Ms. Synora),
                    Solo/Duet Dance, Mono Act, or 3 Stage Showdown. Connect with activity coordinators
                    or reserve your preview slot below!
                  </p>

                  <ul
                    data-testid="talent-roster-list"
                    className="divide-y divide-white/[0.08] border-y border-white/[0.08]"
                  >
                    {talentEntries.map((entry) => (
                      <li key={entry.id} className="py-3 sm:py-3.5 space-y-1 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="text-sm font-semibold text-white">
                            {entry.name}
                          </span>
                          <span className="text-xs text-zinc-400 font-mono">
                            {entry.rollNumber} ·{' '}
                            <span className="text-[#F5A623] font-sans font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                              {entry.category}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          {entry.pitch}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleTalentSubmit} noValidate className="space-y-4 pt-2">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <Mic2 className="w-4 h-4 text-[#F5A623]" />
                    <span>Reserve Stage Showcase Slot</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label
                        htmlFor="talent-name"
                        className="block text-xs font-medium text-zinc-300 mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        id="talent-name"
                        type="text"
                        value={talentName}
                        onChange={(e) => setTalentName(e.target.value)}
                        placeholder="e.g. Sai Sree"
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
                      />
                      {talentErrors.name && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{talentErrors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="talent-roll"
                        className="block text-xs font-medium text-zinc-300 mb-1.5"
                      >
                        Roll Number / USN
                      </label>
                      <input
                        id="talent-roll"
                        type="text"
                        value={talentRoll}
                        onChange={(e) => setTalentRoll(e.target.value)}
                        placeholder="e.g. 26AIML012 / 26AIDS012"
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
                      />
                      {talentErrors.rollNumber && (
                        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{talentErrors.rollNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="talent-category"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Stage Event Category
                    </label>
                    <select
                      id="talent-category"
                      value={talentCategory}
                      onChange={(e) =>
                        setTalentCategory(e.target.value as TalentCategory)
                      }
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white focus:border-[#F5A623] transition-colors"
                    >
                      {TALENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="talent-pitch"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Performance Intro or Act Summary
                    </label>
                    <textarea
                      id="talent-pitch"
                      rows={2}
                      value={talentPitch}
                      onChange={(e) => setTalentPitch(e.target.value)}
                      placeholder="Briefly describe your dance routine, runway style, or mono act monologue..."
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#09090B] border border-white/15 rounded-lg text-white placeholder:text-zinc-500 focus:border-[#F5A623] transition-colors"
                    />
                    {talentErrors.pitch && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{talentErrors.pitch}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-1">
                    <span className="text-xs text-zinc-400 text-center sm:text-left">
                      Open to 1st-year AIML &amp; AIDS students (Batch 2026–2030).
                    </span>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-sm font-semibold text-[#09090B] bg-[#F5A623] hover:bg-[#FFC04D] rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-[0_0_15px_rgba(245,166,35,0.2)] text-center justify-center cursor-pointer"
                    >
                      Reserve Slot
                    </motion.button>
                  </div>

                  {talentSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="status"
                      className="text-xs text-emerald-400 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{talentSuccess}</span>
                    </motion.p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
