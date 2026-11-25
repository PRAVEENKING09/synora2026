import { useEffect, useState } from 'react';
import {
  EVENT_CONFIG,
  ACTIVITIES,
  SCHEDULE_ITEMS,
  INITIAL_SONGS,
  INITIAL_TALENT_ENTRIES,
  type SongRequest,
  type TalentCategory,
  type TalentEntry,
  type ActivityItem,
  type ScheduleItem,
  type EventConfigType,
} from './data/eventData';
import {
  addSongRequest,
  createTalentEntry,
  sortSongsByVotes,
  toggleSongVote,
  type IssuedPass,
} from './utils/partyLogic';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { HighlightsBento } from './components/HighlightsBento';
import { ScheduleSection } from './components/ScheduleSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { RsvpPassSection } from './components/RsvpPassSection';
import { Footer } from './components/Footer';
import { AmbientConstellation } from './components/AmbientConstellation';
import { AdminPortal } from './components/AdminPortal';
import { ShutdownNotice } from './components/ShutdownNotice';
import { setupInspectProtection } from './utils/security';

const STORAGE_KEYS = {
  pass: 'synora26_issued_pass_v1',
  savedSchedule: 'synora26_saved_schedule_v1',
  songs: 'synora26_songs_v1',
  votedSongs: 'synora26_voted_songs_v1',
  talent: 'synora26_talent_v1',
  config: 'synora26_event_config_v2',
  activities: 'synora26_activities_v1',
  schedule: 'synora26_schedule_v1',
} as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function checkIsAdminSecretUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const href = window.location.href.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    href.includes('admin@anosinx') ||
    hash.includes('admin@anosinx') ||
    path.includes('admin@anosinx') ||
    search.includes('admin@anosinx') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    path === '/admin'
  );
}

export default function App() {
  // Admin Portal visibility state (opened via secret URL trigger: admin@anosinx)
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return checkIsAdminSecretUrl();
  });

  // Dynamic Editable Admin State (persisted to localStorage)
  const [eventConfig, setEventConfig] = useState<EventConfigType>(() => {
    const loaded = readStorage<EventConfigType>(STORAGE_KEYS.config, EVENT_CONFIG);
    const needsDeptUpgrade =
      !loaded.department ||
      loaded.department === 'AIML Department' ||
      loaded.department.includes('AI & Machine Learning');
    const needsTaglineUpgrade =
      !loaded.brandTagline ||
      loaded.brandTagline === "AIML Department Freshers' Fest";

    if (!loaded.brandName || loaded.brandName.toLowerCase().includes('epoch')) {
      return {
        ...loaded,
        brandName: 'Synora 2K26',
        brandTagline: "AIML & AIDS Freshers' Fest",
        department: 'AIML & AIDS Department',
      };
    }
    if (needsDeptUpgrade || needsTaglineUpgrade) {
      return {
        ...loaded,
        ...(needsDeptUpgrade ? { department: 'AIML & AIDS Department' } : {}),
        ...(needsTaglineUpgrade ? { brandTagline: "AIML & AIDS Freshers' Fest" } : {}),
      };
    }
    return loaded;
  });
  const [activitiesList, setActivitiesList] = useState<ActivityItem[]>(() =>
    readStorage<ActivityItem[]>(STORAGE_KEYS.activities, ACTIVITIES)
  );
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>(() =>
    readStorage<ScheduleItem[]>(STORAGE_KEYS.schedule, SCHEDULE_ITEMS)
  );

  // Student State
  const [issuedPass, setIssuedPass] = useState<IssuedPass | null>(() =>
    readStorage<IssuedPass | null>(STORAGE_KEYS.pass, null)
  );
  const [savedScheduleIds, setSavedScheduleIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.savedSchedule, [])
  );
  const [songs, setSongs] = useState<SongRequest[]>(() =>
    sortSongsByVotes(readStorage<SongRequest[]>(STORAGE_KEYS.songs, INITIAL_SONGS))
  );
  const [votedSongIds, setVotedSongIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.votedSongs, [])
  );
  const [talentEntries, setTalentEntries] = useState<TalentEntry[]>(() =>
    readStorage<TalentEntry[]>(STORAGE_KEYS.talent, INITIAL_TALENT_ENTRIES)
  );

  // Listen to browser URL changes for secret admin@anosinx trigger
  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminOpen(checkIsAdminSecretUrl());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Activate client-side anti-inspect protection (blocks right-click, F12, Ctrl+Shift+I, and silences console)
  useEffect(() => {
    return setupInspectProtection();
  }, []);

  // Dynamically sync browser tab title with event branding
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${eventConfig.brandName} — ${eventConfig.brandTagline} | ${eventConfig.collegeName}`;
    }
  }, [eventConfig.brandName, eventConfig.brandTagline, eventConfig.collegeName]);

  // Sync admin state to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(eventConfig));
    } catch {
      // Ignore quota errors
    }
  }, [eventConfig]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.activities,
        JSON.stringify(activitiesList)
      );
    } catch {
      // Ignore quota errors
    }
  }, [activitiesList]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.schedule,
        JSON.stringify(scheduleList)
      );
    } catch {
      // Ignore quota errors
    }
  }, [scheduleList]);

  // Sync student pass & choices to localStorage
  useEffect(() => {
    try {
      if (issuedPass) {
        window.localStorage.setItem(STORAGE_KEYS.pass, JSON.stringify(issuedPass));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.pass);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [issuedPass]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.savedSchedule,
        JSON.stringify(savedScheduleIds)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [savedScheduleIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.songs, JSON.stringify(songs));
      window.localStorage.setItem(
        STORAGE_KEYS.votedSongs,
        JSON.stringify(votedSongIds)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [songs, votedSongIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.talent,
        JSON.stringify(talentEntries)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [talentEntries]);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        const cleanHash = url.hash
          .replace(/#?admin@anosinx/gi, '')
          .replace(/^#\/admin|^#admin/gi, '');
        const cleanPath = url.pathname
          .replace(/admin@anosinx/gi, '')
          .replace(/\/admin/gi, '');
        url.searchParams.delete('admin@anosinx');
        const cleanUrl = `${cleanPath || '/'}${url.search ? url.search : ''}${
          cleanHash && cleanHash !== '#' ? cleanHash : ''
        }`;
        window.history.pushState(null, '', cleanUrl || '/');
      } catch {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const handleResetToDefaults = () => {
    setEventConfig(EVENT_CONFIG);
    setActivitiesList(ACTIVITIES);
    setScheduleList(SCHEDULE_ITEMS);
    try {
      window.localStorage.removeItem(STORAGE_KEYS.config);
      window.localStorage.removeItem(STORAGE_KEYS.activities);
      window.localStorage.removeItem(STORAGE_KEYS.schedule);
    } catch {
      // Ignore
    }
  };

  const handleToggleScheduleSave = (itemId: string) => {
    setSavedScheduleIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleToggleSongVote = (songId: string) => {
    const result = toggleSongVote(songs, votedSongIds, songId);
    setSongs(result.songs);
    setVotedSongIds(result.votedIds);
  };

  const handleAddSong = (title: string, artist: string, requestedBy: string) => {
    const result = addSongRequest(songs, votedSongIds, {
      title,
      artist,
      requestedBy,
    });
    setSongs(result.songs);
    setVotedSongIds(result.votedIds);
  };

  const handleAddTalent = (input: {
    name: string;
    rollNumber: string;
    category: TalentCategory;
    pitch: string;
  }) => {
    const entry = createTalentEntry(input, talentEntries.length);
    setTalentEntries((prev) => [entry, ...prev]);
  };

  // If Admin portal is requested, display dedicated Admin experience (with login protection)
  if (isAdminOpen) {
    return (
      <AdminPortal
        config={eventConfig}
        activities={activitiesList}
        scheduleItems={scheduleList}
        onSaveConfig={setEventConfig}
        onSaveActivities={setActivitiesList}
        onSaveSchedule={setScheduleList}
        onResetToDefaults={handleResetToDefaults}
        onCloseAdmin={handleCloseAdmin}
      />
    );
  }

  // -------------------------------------------------------------
  // SHUTDOWN SCREEN (Disabled by default - Main page is active)
  // -------------------------------------------------------------
  const showShutdown = typeof window !== 'undefined' && window.location.hash.toLowerCase() === '#shutdown';

  if (showShutdown) {
    return (
      <div className="relative min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col selection:bg-[#F5A623] selection:text-[#09090B] overflow-x-hidden w-full">
        <AmbientConstellation />
        <ShutdownNotice config={eventConfig} />
      </div>
    );
  }

  // -------------------------------------------------------------
  // STUDENT PORTAL (Main Page)
  // -------------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col selection:bg-[#F5A623] selection:text-[#09090B] overflow-x-hidden w-full">
      {/* 60fps Ambient Particle Constellation background */}
      <AmbientConstellation />

      <Navbar
        hasIssuedPass={Boolean(issuedPass)}
        config={eventConfig}
      />

      <main className="relative z-10 flex-1">
        {/* Hero Section with Kishkinda Univ, AIML, 26-30 Batch & Live Countdown */}
        <HeroSection
          hasIssuedPass={Boolean(issuedPass)}
          config={eventConfig}
        />

        {/* Dedicated 13 Activities & Coordinators Section with Google Forms Registration */}
        <ActivitiesSection
          activities={activitiesList}
          config={eventConfig}
          googleFormUrl={eventConfig.googleFormUrl}
          onUpdateGoogleFormUrl={(url) =>
            setEventConfig((c) => ({ ...c, googleFormUrl: url }))
          }
        />

        {/* Daytime Highlights Bento */}
        <HighlightsBento />

        {/* Daytime Schedule (09:30 AM to 04:30 PM) */}
        <ScheduleSection
          savedIds={savedScheduleIds}
          onToggleSave={handleToggleScheduleSave}
          scheduleItems={scheduleList}
          config={eventConfig}
        />

        {/* Stage Playlist Queue, Stage Signups, Dress Code Lookbook & FAQ */}
        <ShowcaseSection
          songs={songs}
          votedSongIds={votedSongIds}
          onToggleSongVote={handleToggleSongVote}
          onAddSong={handleAddSong}
          talentEntries={talentEntries}
          onAddTalent={handleAddTalent}
        />

        {/* 3D Holographic Entry Pass Section */}
        <RsvpPassSection
          issuedPass={issuedPass}
          onIssuePass={setIssuedPass}
          onResetPass={() => setIssuedPass(null)}
          config={eventConfig}
        />
      </main>

      <Footer
        config={eventConfig}
        activities={activitiesList}
      />
    </div>
  );
}
