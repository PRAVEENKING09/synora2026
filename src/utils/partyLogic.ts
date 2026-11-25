import type {
  ScheduleCategory,
  ScheduleItem,
  SongRequest,
  TalentCategory,
  TalentEntry,
} from '../data/eventData';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

export type StudentBranch = 'AIML' | 'AIDS';
export type StudentSection = 'Section A' | 'Section B' | 'Section C' | 'Lateral Entry';
export type DiningPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Jain / Vegan';
export type ParticipationTrack =
  | 'General Entry'
  | 'Event Contestant (13 Activities)'
  | 'Stage Performer';

export interface RsvpFormInput {
  fullName: string;
  rollNumber: string;
  email: string;
  branch?: StudentBranch;
  section: StudentSection;
  dining: DiningPreference;
  track: ParticipationTrack;
}

export interface RsvpValidationErrors {
  fullName?: string;
  rollNumber?: string;
  email?: string;
}

export interface IssuedPass extends RsvpFormInput {
  branch: StudentBranch;
  passCode: string;
  gate: string;
  diningCode: 'VEG' | 'NON-VEG' | 'JAIN';
  issuedAtIso: string;
}

export interface SongFormInput {
  title: string;
  artist: string;
  requestedBy: string;
}

export interface SongValidationErrors {
  title?: string;
  artist?: string;
}

export interface TalentFormInput {
  name: string;
  rollNumber: string;
  category: TalentCategory;
  pitch: string;
}

export interface TalentValidationErrors {
  name?: string;
  rollNumber?: string;
  pitch?: string;
}

export function getCountdownParts(targetMs: number, nowMs: number): CountdownParts {
  const diff = Math.max(0, targetMs - nowMs);
  if (diff === 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isLive: false };
}

export function padTwo(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, '0');
}

export function validateRsvpForm(input: RsvpFormInput): RsvpValidationErrors {
  const errors: RsvpValidationErrors = {};
  const trimmedName = input.fullName.trim();
  const trimmedRoll = input.rollNumber.trim().toUpperCase();
  const trimmedEmail = input.email.trim();

  if (trimmedName.length < 2) {
    errors.fullName = 'Enter your full name (at least 2 characters).';
  }

  if (!/^[A-Z0-9-]{4,16}$/.test(trimmedRoll)) {
    errors.rollNumber = 'Enter a valid roll number (e.g. 26AIML042 or 26AIDS042).';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
    errors.email = 'Enter a valid college or personal email address.';
  }

  return errors;
}

export function deterministicHash(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function generatePassDetails(
  input: RsvpFormInput,
  issuedAtIso: string = new Date().toISOString()
): IssuedPass {
  const normalizedRoll = input.rollNumber.trim().toUpperCase();
  const normalizedName = input.fullName.trim();
  const normalizedEmail = input.email.trim().toLowerCase();

  const digest = deterministicHash(`${normalizedRoll}|${normalizedEmail}|SYNORA26`);
  const hexSuffix = digest.toString(16).toUpperCase().padStart(8, '0').slice(0, 4);
  const passCode = `SYNORA26-${hexSuffix}`;

  const gateMap: Record<StudentSection, string> = {
    'Section A': 'Auditorium Main Gate · North',
    'Section B': 'Auditorium Main Gate · South',
    'Section C': 'Auditorium Central Foyer',
    'Lateral Entry': 'Auditorium Welcome Desk',
  };

  const diningCodeMap: Record<DiningPreference, 'VEG' | 'NON-VEG' | 'JAIN'> = {
    Vegetarian: 'VEG',
    'Non-Vegetarian': 'NON-VEG',
    'Jain / Vegan': 'JAIN',
  };

  const normalizedBranch: StudentBranch = input.branch === 'AIDS' ? 'AIDS' : 'AIML';

  return {
    fullName: normalizedName,
    rollNumber: normalizedRoll,
    email: normalizedEmail,
    branch: normalizedBranch,
    section: input.section,
    dining: input.dining,
    track: input.track,
    passCode,
    gate: gateMap[input.section],
    diningCode: diningCodeMap[input.dining],
    issuedAtIso,
  };
}

/**
 * Generates a deterministic square boolean matrix resembling a compact QR code
 * with valid 3-corner finder patterns so each pass renders a crisp, unique vector code.
 */
export function generateQrMatrix(seed: string, size: number = 17): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const drawFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 5; r += 1) {
      for (let c = 0; c < 5; c += 1) {
        const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
        const isCenter = r === 2 && c === 2;
        matrix[startRow + r][startCol + c] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 5);
  drawFinder(size - 5, 0);

  let state = deterministicHash(seed) || 1;
  const nextBit = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) % 2 === 0;
  };

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const inTopLeft = r < 6 && c < 6;
      const inTopRight = r < 6 && c >= size - 6;
      const inBottomLeft = r >= size - 6 && c < 6;
      if (inTopLeft || inTopRight || inBottomLeft) continue;
      matrix[r][c] = nextBit();
    }
  }

  return matrix;
}

export type ScheduleFilter = 'all' | ScheduleCategory | 'saved';

export function filterSchedule(
  items: ScheduleItem[],
  activeFilter: ScheduleFilter,
  savedIds: string[]
): ScheduleItem[] {
  if (activeFilter === 'all') return items;
  if (activeFilter === 'saved') {
    const savedSet = new Set(savedIds);
    return items.filter((item) => savedSet.has(item.id));
  }
  return items.filter((item) => item.category === activeFilter);
}

export function sortSongsByVotes(songs: SongRequest[]): SongRequest[] {
  return [...songs].sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return a.title.localeCompare(b.title);
  });
}

export function toggleSongVote(
  songs: SongRequest[],
  votedIds: string[],
  songId: string
): { songs: SongRequest[]; votedIds: string[] } {
  const alreadyVoted = votedIds.includes(songId);
  const nextVotedIds = alreadyVoted
    ? votedIds.filter((id) => id !== songId)
    : [...votedIds, songId];

  const nextSongs = songs.map((song) => {
    if (song.id !== songId) return song;
    return {
      ...song,
      votes: Math.max(0, song.votes + (alreadyVoted ? -1 : 1)),
    };
  });

  return { songs: sortSongsByVotes(nextSongs), votedIds: nextVotedIds };
}

export function validateSongRequest(
  input: SongFormInput,
  existingSongs: SongRequest[]
): SongValidationErrors {
  const errors: SongValidationErrors = {};
  const title = input.title.trim();
  const artist = input.artist.trim();

  if (title.length < 2) {
    errors.title = 'Enter a song title.';
  } else if (
    existingSongs.some(
      (s) =>
        s.title.trim().toLowerCase() === title.toLowerCase() &&
        s.artist.trim().toLowerCase() === artist.toLowerCase()
    )
  ) {
    errors.title = 'This track is already in the queue—upvote it above.';
  }

  if (artist.length < 2) {
    errors.artist = 'Enter the artist name.';
  }

  return errors;
}

export function addSongRequest(
  songs: SongRequest[],
  votedIds: string[],
  input: SongFormInput
): { songs: SongRequest[]; votedIds: string[]; createdId: string } {
  const createdId = `song-${deterministicHash(`${input.title}|${input.artist}|${songs.length}`).toString(36)}`;
  const newSong: SongRequest = {
    id: createdId,
    title: input.title.trim(),
    artist: input.artist.trim(),
    requestedBy: input.requestedBy.trim() || 'Fresher · AIML & AIDS',
    votes: 1,
  };

  return {
    songs: sortSongsByVotes([...songs, newSong]),
    votedIds: [...votedIds, createdId],
    createdId,
  };
}

export function validateTalentSubmission(input: TalentFormInput): TalentValidationErrors {
  const errors: TalentValidationErrors = {};
  if (input.name.trim().length < 2) {
    errors.name = 'Enter your name.';
  }
  if (!/^[A-Z0-9-]{4,16}$/.test(input.rollNumber.trim().toUpperCase())) {
    errors.rollNumber = 'Enter your roll number (e.g. 26AIML042 or 26AIDS042).';
  }
  if (input.pitch.trim().length < 10) {
    errors.pitch = 'Describe your act or introduction in at least 10 characters.';
  }
  return errors;
}

export function createTalentEntry(input: TalentFormInput, existingCount: number): TalentEntry {
  return {
    id: `talent-${existingCount + 1}-${deterministicHash(input.rollNumber + input.name).toString(36).slice(0, 4)}`,
    name: input.name.trim(),
    rollNumber: input.rollNumber.trim().toUpperCase(),
    category: input.category,
    pitch: input.pitch.trim(),
  };
}
