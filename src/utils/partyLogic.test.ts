import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addSongRequest,
  createTalentEntry,
  filterSchedule,
  generatePassDetails,
  generateQrMatrix,
  getCountdownParts,
  padTwo,
  toggleSongVote,
  validateRsvpForm,
  validateSongRequest,
  validateTalentSubmission,
} from './partyLogic';
import { INITIAL_SONGS, SCHEDULE_ITEMS } from '../data/eventData';

test('getCountdownParts calculates days, hours, minutes, seconds accurately', () => {
  const now = Date.UTC(2026, 11, 10, 12, 0, 0);
  const target = Date.UTC(2026, 11, 12, 14, 30, 45);
  const parts = getCountdownParts(target, now);

  assert.deepEqual(parts, {
    days: 2,
    hours: 2,
    minutes: 30,
    seconds: 45,
    isLive: false,
  });
  assert.equal(padTwo(parts.days), '02');
});

test('getCountdownParts clamps past event times to live state', () => {
  const now = Date.UTC(2026, 11, 13, 0, 0, 0);
  const target = Date.UTC(2026, 11, 12, 18, 0, 0);
  const parts = getCountdownParts(target, now);

  assert.equal(parts.isLive, true);
  assert.equal(parts.days, 0);
  assert.equal(parts.seconds, 0);
});

test('validateRsvpForm rejects blank or malformed fields and accepts valid input', () => {
  const invalidErrors = validateRsvpForm({
    fullName: 'A',
    rollNumber: 'bad roll!',
    email: 'not-an-email',
    section: 'Section A',
    dining: 'Vegetarian',
    track: 'General Entry',
  });

  assert.ok(invalidErrors.fullName);
  assert.ok(invalidErrors.rollNumber);
  assert.ok(invalidErrors.email);

  const validErrors = validateRsvpForm({
    fullName: 'Ananya Sharma',
    rollNumber: '26AIML042',
    email: 'ananya.sharma@aiml.edu',
    section: 'Section B',
    dining: 'Vegetarian',
    track: 'Event Contestant (13 Activities)',
  });

  assert.deepEqual(validErrors, {});
});

test('generatePassDetails produces deterministic pass code, gate, and QR matrix', () => {
  const input = {
    fullName: '  Ananya Sharma ',
    rollNumber: '26aiml042',
    email: 'ANANYA@AIML.EDU',
    section: 'Section B' as const,
    dining: 'Jain / Vegan' as const,
    track: 'General Entry' as const,
  };

  const passA = generatePassDetails(input, '2026-11-21T10:00:00.000Z');
  const passB = generatePassDetails(input, '2026-11-21T10:00:00.000Z');

  assert.equal(passA.passCode, passB.passCode);
  assert.match(passA.passCode, /^SYNORA26-[A-F0-9]{4}$/);
  assert.equal(passA.rollNumber, '26AIML042');
  assert.equal(passA.branch, 'AIML');
  assert.equal(passA.gate, 'Auditorium Main Gate · South');
  assert.equal(passA.diningCode, 'JAIN');

  const aidsPass = generatePassDetails(
    { ...input, rollNumber: '26aids018', branch: 'AIDS' },
    '2026-11-21T10:00:00.000Z'
  );
  assert.equal(aidsPass.rollNumber, '26AIDS018');
  assert.equal(aidsPass.branch, 'AIDS');

  const qr1 = generateQrMatrix(passA.passCode, 17);
  const qr2 = generateQrMatrix(passB.passCode, 17);
  assert.equal(qr1.length, 17);
  assert.equal(qr1[0].length, 17);
  assert.deepEqual(qr1, qr2);
  // Finder corner check
  assert.equal(qr1[0][0], true);
  assert.equal(qr1[2][2], true);
});

test('filterSchedule supports category and saved itinerary filters', () => {
  const stageItems = filterSchedule(SCHEDULE_ITEMS, 'stage', []);
  assert.ok(stageItems.length > 0);
  assert.ok(stageItems.every((item) => item.category === 'stage'));

  const savedItems = filterSchedule(SCHEDULE_ITEMS, 'saved', ['inauguration', 'stage-showcase']);
  assert.equal(savedItems.length, 2);
  assert.deepEqual(
    savedItems.map((i) => i.id),
    ['inauguration', 'stage-showcase']
  );
});

test('song request validation, addition, and vote toggling work end-to-end', () => {
  const dupErrors = validateSongRequest(
    { title: 'Starboy', artist: 'The Weeknd ft. Daft Punk', requestedBy: 'Me' },
    INITIAL_SONGS
  );
  assert.ok(dupErrors.title);

  const added = addSongRequest(INITIAL_SONGS, [], {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    requestedBy: 'Kabir S.',
  });
  assert.equal(added.songs.length, INITIAL_SONGS.length + 1);
  assert.ok(added.votedIds.includes(added.createdId));

  const initialSong2 = INITIAL_SONGS.find((s) => s.id === 'song-2');
  const baseVotes = initialSong2?.votes ?? 0;

  const upvoted = toggleSongVote(INITIAL_SONGS, [], 'song-2');
  const song2AfterUp = upvoted.songs.find((s) => s.id === 'song-2');
  assert.equal(song2AfterUp?.votes, baseVotes + 1);
  assert.ok(upvoted.votedIds.includes('song-2'));

  const unvoted = toggleSongVote(upvoted.songs, upvoted.votedIds, 'song-2');
  const song2AfterDown = unvoted.songs.find((s) => s.id === 'song-2');
  assert.equal(song2AfterDown?.votes, baseVotes);
  assert.ok(!unvoted.votedIds.includes('song-2'));
});

test('talent submission validates required inputs and creates clean roster entry', () => {
  const errs = validateTalentSubmission({
    name: '',
    rollNumber: '12',
    category: 'Solo / Duet Dance',
    pitch: 'short',
  });
  assert.ok(errs.name);
  assert.ok(errs.rollNumber);
  assert.ok(errs.pitch);

  const validInput = {
    name: 'Nikhil Rao',
    rollNumber: '26aiml105',
    category: 'Mono Act / Dramatics' as const,
    pitch: 'A 3-minute stand-up set about surviving first-year engineering labs.',
  };
  assert.deepEqual(validateTalentSubmission(validInput), {});
  const entry = createTalentEntry(validInput, 3);
  assert.equal(entry.rollNumber, '26AIML105');
  assert.equal(entry.category, 'Mono Act / Dramatics');
});
