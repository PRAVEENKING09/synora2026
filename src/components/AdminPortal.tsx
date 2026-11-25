import { useState, type FormEvent } from 'react';
import {
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ArrowLeft,
  Settings,
  Sparkles,
  FileSpreadsheet,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  EVENT_CONFIG,
  ACTIVITIES,
  SCHEDULE_ITEMS,
  HIGHLIGHT_ITEMS,
  type ActivityItem,
  type ActivityCategory,
  type ScheduleItem,
  type ScheduleCategory,
  type HighlightItem,
  type EventConfigType,
} from '../data/eventData';
import { verifyAdminCredentials } from '../utils/security';

export interface AdminPortalProps {
  config: EventConfigType;
  activities: ActivityItem[];
  scheduleItems: ScheduleItem[];
  highlights?: HighlightItem[];
  onSaveConfig: (newConfig: EventConfigType) => void;
  onSaveActivities: (newActivities: ActivityItem[]) => void;
  onSaveSchedule: (newSchedule: ScheduleItem[]) => void;
  onSaveHighlights?: (newHighlights: HighlightItem[]) => void;
  onResetToDefaults: () => void;
  onCloseAdmin: () => void;
}

export function AdminPortal({
  config,
  activities,
  scheduleItems,
  highlights = HIGHLIGHT_ITEMS,
  onSaveConfig,
  onSaveActivities,
  onSaveSchedule,
  onSaveHighlights,
  onResetToDefaults,
  onCloseAdmin,
}: AdminPortalProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('synora26_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin Dashboard Tabs: 'events' | 'activities' | 'schedule' | 'highlights'
  const [activeTab, setActiveTab] = useState<'events' | 'activities' | 'schedule' | 'highlights'>('events');

  // Form states for Event Config
  const [configDraft, setConfigDraft] = useState<EventConfigType>(config);

  // Form states for Activities
  const [activitiesDraft, setActivitiesDraft] = useState<ActivityItem[]>(activities);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [isNewActivityModal, setIsNewActivityModal] = useState(false);

  // Form states for Schedule
  const [scheduleDraft, setScheduleDraft] = useState<ScheduleItem[]>(scheduleItems);
  const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);
  const [isNewScheduleModal, setIsNewScheduleModal] = useState(false);

  // Form states for Highlights & Photos
  const [highlightsDraft, setHighlightsDraft] = useState<HighlightItem[]>(highlights);
  const [editingHighlight, setEditingHighlight] = useState<HighlightItem | null>(null);
  const [isNewHighlightModal, setIsNewHighlightModal] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Secure asynchronous login handler (verifies SHA-256 hash without plaintext in memory/console)
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const isValid = await verifyAdminCredentials(usernameInput, passwordInput);
      if (isValid) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem('synora26_admin_auth', 'true');
        } catch {
          // Ignore session storage error
        }
        showToast('Welcome, Administrator! Authenticated successfully.');
      } else {
        setLoginError('Invalid administrator credentials. Access denied.');
      }
    } catch {
      setLoginError('Authentication verification encountered an error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('synora26_admin_auth');
    } catch {
      // Ignore
    }
  };

  // Save Event Config
  const handleSaveConfig = (e: FormEvent) => {
    e.preventDefault();
    onSaveConfig(configDraft);
    showToast('Event dates, timings, and college settings saved live!');
  };

  // Save single activity edits
  const handleSaveActivityModal = (e: FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    // Format raw phone number for WhatsApp and tel
    const rawDigits = editingActivity.contactNumber.replace(/\D/g, '');
    const contactRaw = rawDigits.startsWith('91') && rawDigits.length === 12
      ? rawDigits
      : rawDigits.length === 10
      ? `91${rawDigits}`
      : rawDigits;

    const updated = {
      ...editingActivity,
      contactRaw,
    };

    let nextActivities: ActivityItem[];
    if (isNewActivityModal) {
      nextActivities = [...activitiesDraft, updated];
    } else {
      nextActivities = activitiesDraft.map((act) =>
        act.id === updated.id ? updated : act
      );
    }

    setActivitiesDraft(nextActivities);
    onSaveActivities(nextActivities);
    setEditingActivity(null);
    setIsNewActivityModal(false);
    showToast(`Activity "${updated.title}" saved successfully!`);
  };

  // Delete an activity
  const handleDeleteActivity = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the activity "${title}"?`)) {
      const next = activitiesDraft.filter((act) => act.id !== id);
      setActivitiesDraft(next);
      onSaveActivities(next);
      showToast(`Deleted "${title}".`);
    }
  };

  // Open add new activity modal
  const handleOpenNewActivity = () => {
    const newSlNo = activitiesDraft.length + 1;
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      slNo: newSlNo,
      title: 'New Activity',
      category: 'Sports',
      coordinatorName: 'Coordinator Name',
      contactNumber: '99999 99999',
      contactRaw: '919999999999',
      venue: 'Main Auditorium / Sports Arena',
      timing: '10:30 AM – 12:30 PM',
      teamType: 'Solo / Squad',
      tag: 'Exciting Challenge',
      description: 'Activity description for 1st-year freshers.',
      rules: ['Standard rules apply.', '1st-year AIML & AIDS students eligible.'],
    };
    setEditingActivity(newAct);
    setIsNewActivityModal(true);
  };

  // Delete a schedule item
  const handleDeleteScheduleItem = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove the timeline slot "${title}"?`)) {
      const next = scheduleDraft.filter((item) => item.id !== id);
      setScheduleDraft(next);
      onSaveSchedule(next);
      showToast(`Removed timeline slot "${title}".`);
    }
  };

  // Open add new schedule slot modal
  const handleOpenNewScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: `sched-${Date.now()}`,
      time: '16:30',
      duration: '30 min',
      title: 'New Fest Event',
      location: 'Main Auditorium',
      category: 'stage',
      categoryLabel: 'Stage',
      description: 'Session details and event description for students.',
      lead: 'Senior Student Council',
    };
    setEditingScheduleItem(newItem);
    setIsNewScheduleModal(true);
  };

  // Save schedule item edits
  const handleSaveScheduleModal = (e: FormEvent) => {
    e.preventDefault();
    if (!editingScheduleItem) return;

    let next: ScheduleItem[];
    if (isNewScheduleModal) {
      next = [...scheduleDraft, editingScheduleItem];
    } else {
      next = scheduleDraft.map((item) =>
        item.id === editingScheduleItem.id ? editingScheduleItem : item
      );
    }
    setScheduleDraft(next);
    onSaveSchedule(next);
    setEditingScheduleItem(null);
    setIsNewScheduleModal(false);
    showToast(
      isNewScheduleModal
        ? `Timeline slot "${editingScheduleItem.title}" added successfully.`
        : `Timeline item "${editingScheduleItem.title}" updated.`
    );
  };

  // Delete a highlight photo card
  const handleDeleteHighlight = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the photo highlight card "${title}"?`)) {
      const next = highlightsDraft.filter((h) => h.id !== id);
      setHighlightsDraft(next);
      onSaveHighlights?.(next);
      showToast(`Deleted highlight "${title}".`);
    }
  };

  // Remove/clear photo from highlight card
  const handleRemovePhotoFromHighlight = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove the photo from "${title}"?`)) {
      const next = highlightsDraft.map((h) =>
        h.id === id ? { ...h, image: '' } : h
      );
      setHighlightsDraft(next);
      onSaveHighlights?.(next);
      showToast(`Removed photo from "${title}".`);
    }
  };

  // Open add new highlight modal
  const handleOpenNewHighlight = () => {
    const newHl: HighlightItem = {
      id: `hl-${Date.now()}`,
      badge: 'Fest Spotlight',
      badgeCategory: 'stage',
      timeAndVenue: 'Main Auditorium',
      title: 'New Fest Arena',
      description: 'Signature celebration segment curated for freshers.',
      image: '',
      fallbackTitle: 'New Fest Arena',
      colSpan: 1,
    };
    setEditingHighlight(newHl);
    setIsNewHighlightModal(true);
  };

  // Save highlight edits/creation
  const handleSaveHighlightModal = (e: FormEvent) => {
    e.preventDefault();
    if (!editingHighlight) return;

    let next: HighlightItem[];
    if (isNewHighlightModal) {
      next = [...highlightsDraft, editingHighlight];
    } else {
      next = highlightsDraft.map((h) =>
        h.id === editingHighlight.id ? editingHighlight : h
      );
    }
    setHighlightsDraft(next);
    onSaveHighlights?.(next);
    setEditingHighlight(null);
    setIsNewHighlightModal(false);
    showToast(
      isNewHighlightModal
        ? `Created highlight photo card "${editingHighlight.title}".`
        : `Updated highlight photo card "${editingHighlight.title}".`
    );
  };

  // Reset to original factory defaults
  const handleResetConfirm = () => {
    if (
      confirm(
        'Are you sure you want to reset all dates, activities, timings, and highlights to the official AIML & AIDS Department defaults?'
      )
    ) {
      onResetToDefaults();
      setConfigDraft(EVENT_CONFIG);
      setActivitiesDraft(ACTIVITIES);
      setScheduleDraft(SCHEDULE_ITEMS);
      setHighlightsDraft(HIGHLIGHT_ITEMS);
      showToast('All data has been reset to official department defaults.');
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: ADMIN LOGIN PAGE (Students never see this by default)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col justify-center items-center p-4 relative z-50">
        {/* Ambient Amber Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#F5A623]/10 rounded-full blur-[120px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121216] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10"
        >
          {/* Back button */}
          <button
            type="button"
            onClick={onCloseAdmin}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Freshers Portal</span>
          </button>

          {/* Admin Header */}
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/[0.08]">
            <img
              src="/kishkinda-logo.png"
              alt="Kishkinda University"
              className="w-11 h-11 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]"
            />
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight">
                Admin Authentication
              </h2>
              <p className="text-xs text-amber-300 font-mono">
                {config.brandName} · {config.collegeName}
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Authorized administrative access for the AIML &amp; AIDS Organizing Committee
            to modify event dates, activity timings, venues, and coordinator contact details.
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Administrator Username
              </label>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter administrator ID"
                className="w-full px-3.5 py-2.5 text-sm bg-[#09090B] border border-white/15 focus:border-[#F5A623] rounded-xl text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-[#09090B] border border-white/15 focus:border-[#F5A623] rounded-xl text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#F5A623] hover:bg-[#FFC04D] disabled:opacity-60 text-[#09090B] font-bold text-sm shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:shadow-[0_0_25px_rgba(245,166,35,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Key className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Access...' : 'Sign In to Admin Portal'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ADMIN MANAGEMENT DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col relative z-50">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#121216]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F5A623]/20 border border-[#F5A623]/40 flex items-center justify-center text-[#F5A623]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm sm:text-base block leading-tight">
              {configDraft.brandName} Admin Console
            </span>
            <span className="text-[11px] text-amber-300 font-mono block">
              {configDraft.collegeName} · {configDraft.department}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCloseAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F5A623]" />
            <span className="hidden sm:inline">View Live Student Portal</span>
            <span className="sm:hidden">Live Site</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Log out of Admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#16161C] border border-white/10 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-[#F5A623] text-[#09090B]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              1. Event Dates &amp; Venue
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'activities'
                  ? 'bg-[#F5A623] text-[#09090B]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              2. 13 Activities &amp; Coordinators ({activitiesDraft.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'bg-[#F5A623] text-[#09090B]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              3. Daytime Timeline ({scheduleDraft.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('highlights')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'highlights'
                  ? 'bg-[#F5A623] text-[#09090B]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              4. Highlights &amp; Photos ({highlightsDraft.length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetConfirm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs text-zinc-300 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Dept Defaults</span>
          </button>
        </div>

        {/* TAB 1: EVENT DATES & GENERAL SETTINGS */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl"
          >
            <div className="mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                Event Dates, Times &amp; Location
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Change the freshers' day date, countdown target, venue, and Google Form link.
                Updates reflect immediately across the entire portal.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Freshers' Day Date Display
                  </label>
                  <input
                    type="text"
                    value={configDraft.dateDisplay}
                    onChange={(e) =>
                      setConfigDraft((s) => ({ ...s, dateDisplay: e.target.value }))
                    }
                    placeholder="e.g. Friday, Dec 4, 2026"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    e.g. Friday, Dec 4, 2026 (4th December)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Event Time Display
                  </label>
                  <input
                    type="text"
                    value={configDraft.timeDisplay}
                    onChange={(e) =>
                      setConfigDraft((s) => ({ ...s, timeDisplay: e.target.value }))
                    }
                    placeholder="e.g. 9:30 AM – 4:30 PM (Daytime Fest)"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Strictly daytime (9:30 AM – 4:30 PM)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Countdown Target ISO Timestamp
                </label>
                <input
                  type="text"
                  value={configDraft.eventStartIso}
                  onChange={(e) =>
                    setConfigDraft((s) => ({ ...s, eventStartIso: e.target.value }))
                  }
                  placeholder="2026-12-04T09:30:00+05:30"
                  required
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Format: YYYY-MM-DDTHH:MM:SS+05:30. Used by the live hero countdown timer!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    College Name
                  </label>
                  <input
                    type="text"
                    value={configDraft.collegeName}
                    onChange={(e) =>
                      setConfigDraft((s) => ({ ...s, collegeName: e.target.value }))
                    }
                    placeholder="Kishkinda University"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={configDraft.department}
                    onChange={(e) =>
                      setConfigDraft((s) => ({ ...s, department: e.target.value }))
                    }
                    placeholder="AIML & AIDS Department"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    First-Year Batch Label
                  </label>
                  <input
                    type="text"
                    value={configDraft.batchLabel}
                    onChange={(e) =>
                      setConfigDraft((s) => ({ ...s, batchLabel: e.target.value }))
                    }
                    placeholder="Batch of 2026–2030 (26–30 Batch)"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Fest Brand Name
                  </label>
                  <input
                    type="text"
                    value={configDraft.brandName}
                    onChange={(e) =>
                      setConfigDraft((s) => ({ ...s, brandName: e.target.value }))
                    }
                    placeholder="Synora 2K26"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Venue (Short)
                  </label>
                  <input
                    type="text"
                    value={configDraft.venueShort}
                    onChange={(e) =>
                      setConfigDraft((s) => ({ ...s, venueShort: e.target.value }))
                    }
                    placeholder="Auditorium"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Full Venue Address
                  </label>
                  <input
                    type="text"
                    value={configDraft.venueFull}
                    onChange={(e) =>
                      setConfigDraft((s) => ({ ...s, venueFull: e.target.value }))
                    }
                    placeholder="Main Auditorium, Kishkinda University Campus"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Official Google Forms Registration URL
                </label>
                <input
                  type="url"
                  value={configDraft.googleFormUrl}
                  onChange={(e) =>
                    setConfigDraft((s) => ({ ...s, googleFormUrl: e.target.value }))
                  }
                  placeholder="https://docs.google.com/forms/..."
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-xl text-white focus:outline-none"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Students will be directed to this Google Form when clicking "Register for Activities".
                </span>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5A623] hover:bg-[#FFC04D] text-[#09090B] font-bold text-sm shadow-[0_0_20px_rgba(245,166,35,0.3)] transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Event Configuration</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* TAB 2: 13 ACTIVITIES & COORDINATORS MANAGER */}
        {activeTab === 'activities' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Activities &amp; Coordinators ({activitiesDraft.length})
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Update event names, dates/timings, venues, rules, coordinator names, and phone numbers.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewActivity}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F5A623] text-[#09090B] font-bold text-xs shadow-[0_0_15px_rgba(245,166,35,0.25)] hover:bg-[#FFC04D] transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Activity</span>
              </button>
            </div>

            {/* Activities Table */}
            <div className="rounded-2xl border border-white/10 bg-[#121216] overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 text-[11px] uppercase tracking-wider font-semibold bg-white/[0.02]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Activity Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Coordinator</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Timing &amp; Venue</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {activitiesDraft.map((act) => (
                    <tr key={act.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">
                        {String(act.slNo).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {act.title}
                        <span className="block text-[11px] font-normal text-zinc-400">
                          {act.teamType} · {act.tag}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                          {act.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {act.coordinatorName}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-300">
                        {act.contactNumber}
                      </td>
                      <td className="py-3 px-4 text-xs text-zinc-400">
                        <span className="text-zinc-200 block">{act.timing}</span>
                        <span className="text-[11px] text-zinc-500 block truncate max-w-[180px]">
                          {act.venue}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingActivity({ ...act });
                              setIsNewActivityModal(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                            title="Edit Activity"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#F5A623]" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(act.id, act.title)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Delete Activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: DAYTIME TIMELINE SCHEDULE MANAGER */}
        {activeTab === 'schedule' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Daytime Timeline Schedule ({scheduleDraft.length})
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Modify schedule times, session titles, locations, descriptions, and leads.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewScheduleItem}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F5A623] text-[#09090B] font-bold text-xs shadow-[0_0_15px_rgba(245,166,35,0.25)] hover:bg-[#FFC04D] transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Timeline Slot</span>
              </button>
            </div>

            <div className="space-y-3">
              {scheduleDraft.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-white/10 bg-[#121216] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="font-mono text-lg font-bold text-amber-300 w-16 shrink-0">
                      {item.time}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-white">
                          {item.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-[#F5A623]">
                          {item.categoryLabel}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-mono mt-1">
                        Location: {item.location} · Lead: {item.lead}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingScheduleItem({ ...item });
                        setIsNewScheduleModal(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>Edit Timeline Slot</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScheduleItem(item.id, item.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove Timeline Slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: HIGHLIGHTS & PHOTOS BENTO MANAGER */}
        {activeTab === 'highlights' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Signature Highlights &amp; Photos ({highlightsDraft.length})
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Manage signature fest arena cards and photos displayed on the main portal. Delete cards or remove photo images dynamically.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewHighlight}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F5A623] text-[#09090B] font-bold text-xs shadow-[0_0_15px_rgba(245,166,35,0.25)] hover:bg-[#FFC04D] transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Photo Highlight</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlightsDraft.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#121216] overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  <div className="relative h-48 bg-[#09090B] overflow-hidden border-b border-white/10 group">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-zinc-500 bg-black/40">
                        <ImageIcon className="w-8 h-8 text-zinc-600" />
                        <span className="text-xs font-medium">No Photo Image</span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md border border-white/10 text-amber-300">
                        {item.badge}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300">
                        {item.colSpan === 2 ? 'Wide (2-Col)' : 'Standard (1-Col)'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs font-mono text-[#F5A623] mb-2">
                        {item.timeAndVenue}
                      </p>
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingHighlight({ ...item });
                            setIsNewHighlightModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#F5A623]" />
                          <span>Edit Card</span>
                        </button>
                        {item.image && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhotoFromHighlight(item.id, item.title)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500/15 border border-white/10 text-xs font-medium text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                            title="Remove the photo from this card"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteHighlight(item.id, item.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Delete this highlight card completely"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Card</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* EDIT / CREATE ACTIVITY MODAL */}
      <AnimatePresence>
        {editingActivity && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setEditingActivity(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#16161C] p-6 shadow-2xl relative text-left my-8"
            >
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-display text-lg font-bold text-white mb-1">
                {isNewActivityModal ? 'Add New Activity' : `Edit: ${editingActivity.title}`}
              </h4>
              <p className="text-xs text-amber-300 font-mono mb-4">
                Synora 2K26 Activity &amp; Coordinator Details
              </p>

              <form onSubmit={handleSaveActivityModal} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Activity Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editingActivity.title}
                      onChange={(e) =>
                        setEditingActivity((s) => s && { ...s, title: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Category
                    </label>
                    <select
                      value={editingActivity.category}
                      onChange={(e) =>
                        setEditingActivity(
                          (s) =>
                            s && {
                              ...s,
                              category: e.target.value as ActivityItem['category'],
                            }
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    >
                      <option value="Sports">Sports</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Creative">Creative</option>
                      <option value="Gaming & Intellect">Gaming &amp; Intellect</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Coordinator Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editingActivity.coordinatorName}
                      onChange={(e) =>
                        setEditingActivity(
                          (s) => s && { ...s, coordinatorName: e.target.value }
                        )
                      }
                      placeholder="e.g. TN Basavaraj"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Contact Number (Phone)
                    </label>
                    <input
                      type="text"
                      required
                      value={editingActivity.contactNumber}
                      onChange={(e) =>
                        setEditingActivity(
                          (s) => s && { ...s, contactNumber: e.target.value }
                        )
                      }
                      placeholder="e.g. 73538 73799"
                      className="w-full px-3 py-2 text-xs font-mono bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Timing Slot
                    </label>
                    <input
                      type="text"
                      required
                      value={editingActivity.timing}
                      onChange={(e) =>
                        setEditingActivity(
                          (s) => s && { ...s, timing: e.target.value }
                        )
                      }
                      placeholder="e.g. 10:15 AM – 12:45 PM"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      required
                      value={editingActivity.venue}
                      onChange={(e) =>
                        setEditingActivity(
                          (s) => s && { ...s, venue: e.target.value }
                        )
                      }
                      placeholder="e.g. Campus Turf / Auditorium"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Team Type
                    </label>
                    <input
                      type="text"
                      required
                      value={editingActivity.teamType}
                      onChange={(e) =>
                        setEditingActivity(
                          (s) => s && { ...s, teamType: e.target.value }
                        )
                      }
                      placeholder="e.g. Squad (6–8 Players)"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Highlight Tag
                    </label>
                    <input
                      type="text"
                      required
                      value={editingActivity.tag}
                      onChange={(e) =>
                        setEditingActivity((s) => s && { ...s, tag: e.target.value })
                      }
                      placeholder="e.g. High Energy"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingActivity.description}
                    onChange={(e) =>
                      setEditingActivity(
                        (s) => s && { ...s, description: e.target.value }
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Rules &amp; Guidelines (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editingActivity.rules.join('\n')}
                    onChange={(e) =>
                      setEditingActivity(
                        (s) =>
                          s && {
                            ...s,
                            rules: e.target.value
                              .split('\n')
                              .map((r) => r.trim())
                              .filter(Boolean),
                          }
                      )
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 mt-4">
                  {!isNewActivityModal ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (editingActivity) {
                          const { id, title } = editingActivity;
                          handleDeleteActivity(id, title);
                          setEditingActivity(null);
                        }
                      }}
                      className="px-3.5 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Delete this activity completely"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Activity</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingActivity(null)}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#F5A623] text-[#09090B] font-bold text-xs shadow-[0_0_15px_rgba(245,166,35,0.3)] hover:bg-[#FFC04D] cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT / CREATE SCHEDULE MODAL */}
      <AnimatePresence>
        {editingScheduleItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setEditingScheduleItem(null);
              setIsNewScheduleModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#16161C] p-6 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => {
                  setEditingScheduleItem(null);
                  setIsNewScheduleModal(false);
                }}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-display text-lg font-bold text-white mb-1">
                {isNewScheduleModal ? 'Add New Timeline Slot' : 'Edit Schedule Slot'}
              </h4>
              <p className="text-xs text-amber-300 font-mono mb-4">
                {isNewScheduleModal ? 'Create a new daytime schedule slot for the fest' : `${editingScheduleItem.time} · ${editingScheduleItem.title}`}
              </p>

              <form onSubmit={handleSaveScheduleModal} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      required
                      value={editingScheduleItem.time}
                      onChange={(e) =>
                        setEditingScheduleItem(
                          (s) => s && { ...s, time: e.target.value }
                        )
                      }
                      placeholder="e.g. 09:30"
                      className="w-full px-3 py-2 text-xs font-mono bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={editingScheduleItem.duration}
                      onChange={(e) =>
                        setEditingScheduleItem(
                          (s) => s && { ...s, duration: e.target.value }
                        )
                      }
                      placeholder="e.g. 45 min"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Category
                    </label>
                    <select
                      value={editingScheduleItem.category}
                      onChange={(e) => {
                        const cat = e.target.value as ScheduleCategory;
                        const labelMap: Record<ScheduleCategory, string> = {
                          stage: 'Stage',
                          sports: 'Sports',
                          creative: 'Creative',
                          dining: 'Dining',
                        };
                        setEditingScheduleItem(
                          (s) =>
                            s && {
                              ...s,
                              category: cat,
                              categoryLabel: labelMap[cat] || 'Stage',
                            }
                        );
                      }}
                      className="w-full px-3 py-2 text-xs bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-lg text-white cursor-pointer"
                    >
                      <option value="stage">Stage</option>
                      <option value="sports">Sports</option>
                      <option value="creative">Creative</option>
                      <option value="dining">Dining</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Category Badge
                    </label>
                    <input
                      type="text"
                      required
                      value={editingScheduleItem.categoryLabel}
                      onChange={(e) =>
                        setEditingScheduleItem(
                          (s) => s && { ...s, categoryLabel: e.target.value }
                        )
                      }
                      placeholder="e.g. Stage"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Slot Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingScheduleItem.title}
                    onChange={(e) =>
                      setEditingScheduleItem(
                        (s) => s && { ...s, title: e.target.value }
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={editingScheduleItem.location}
                    onChange={(e) =>
                      setEditingScheduleItem(
                        (s) => s && { ...s, location: e.target.value }
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingScheduleItem.description}
                    onChange={(e) =>
                      setEditingScheduleItem(
                        (s) => s && { ...s, description: e.target.value }
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Coordination Lead
                  </label>
                  <input
                    type="text"
                    value={editingScheduleItem.lead ?? ''}
                    onChange={(e) =>
                      setEditingScheduleItem(
                        (s) => s && { ...s, lead: e.target.value }
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingScheduleItem(null);
                      setIsNewScheduleModal(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#F5A623] text-[#09090B] font-bold text-xs shadow-[0_0_15px_rgba(245,166,35,0.3)] hover:bg-[#FFC04D] cursor-pointer"
                  >
                    {isNewScheduleModal ? 'Add Slot' : 'Update Slot'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT / CREATE HIGHLIGHT MODAL */}
      <AnimatePresence>
        {editingHighlight && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => {
              setEditingHighlight(null);
              setIsNewHighlightModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#16161C] p-6 shadow-2xl relative text-left my-8"
            >
              <button
                type="button"
                onClick={() => {
                  setEditingHighlight(null);
                  setIsNewHighlightModal(false);
                }}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-display text-lg font-bold text-white mb-1">
                {isNewHighlightModal ? 'Add New Photo Highlight' : 'Edit Highlight Photo Card'}
              </h4>
              <p className="text-xs text-amber-300 font-mono mb-4">
                {isNewHighlightModal ? 'Configure card title, arena badge, and photo image' : editingHighlight.title}
              </p>

              <form onSubmit={handleSaveHighlightModal} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Arena / Card Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingHighlight.title}
                    onChange={(e) =>
                      setEditingHighlight((s) => s && { ...s, title: e.target.value })
                    }
                    placeholder="e.g. 01. Grand Stage: Ramp Walk"
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      required
                      value={editingHighlight.badge}
                      onChange={(e) =>
                        setEditingHighlight((s) => s && { ...s, badge: e.target.value })
                      }
                      placeholder="e.g. Main Stage"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Badge Category Icon
                    </label>
                    <select
                      value={editingHighlight.badgeCategory}
                      onChange={(e) =>
                        setEditingHighlight(
                          (s) =>
                            s && {
                              ...s,
                              badgeCategory: e.target.value as 'stage' | 'sports' | 'gaming' | 'creative',
                            }
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-lg text-white cursor-pointer"
                    >
                      <option value="stage">Stage (Trophy)</option>
                      <option value="sports">Sports (Shield)</option>
                      <option value="gaming">Gaming &amp; Intellect</option>
                      <option value="creative">Creative Arts</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Timing &amp; Venue
                    </label>
                    <input
                      type="text"
                      required
                      value={editingHighlight.timeAndVenue}
                      onChange={(e) =>
                        setEditingHighlight((s) => s && { ...s, timeAndVenue: e.target.value })
                      }
                      placeholder="e.g. 10:15 AM · Turf Arena"
                      className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Card Width
                    </label>
                    <select
                      value={editingHighlight.colSpan ?? 1}
                      onChange={(e) =>
                        setEditingHighlight(
                          (s) =>
                            s && {
                              ...s,
                              colSpan: Number(e.target.value) as 1 | 2,
                            }
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-[#16161C] border border-white/15 focus:border-[#F5A623] rounded-lg text-white cursor-pointer"
                    >
                      <option value={1}>Standard Card (1-Column)</option>
                      <option value={2}>Wide Marquee Card (2-Columns)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-zinc-300">
                      Photo Image URL / Path
                    </label>
                    {editingHighlight.image && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingHighlight((s) => s && { ...s, image: '' })
                        }
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Photo Image</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingHighlight.image}
                    onChange={(e) =>
                      setEditingHighlight((s) => s && { ...s, image: e.target.value })
                    }
                    placeholder="Enter image URL or leave empty for no photo"
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                  {editingHighlight.image && (
                    <div className="mt-2 h-24 rounded-lg overflow-hidden border border-white/10 bg-black/50 relative">
                      <img
                        src={editingHighlight.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-1 right-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-zinc-300">
                        Photo Preview
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingHighlight.description}
                    onChange={(e) =>
                      setEditingHighlight((s) => s && { ...s, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 focus:border-[#F5A623] rounded-lg text-white"
                  />
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 mt-4">
                  {!isNewHighlightModal ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (editingHighlight) {
                          const { id, title } = editingHighlight;
                          handleDeleteHighlight(id, title);
                          setEditingHighlight(null);
                        }
                      }}
                      className="px-3.5 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Card</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHighlight(null);
                        setIsNewHighlightModal(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#F5A623] text-[#09090B] font-bold text-xs shadow-[0_0_15px_rgba(245,166,35,0.3)] hover:bg-[#FFC04D] cursor-pointer"
                    >
                      {isNewHighlightModal ? 'Create Highlight' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Save Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/95 text-black font-semibold text-xs shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
