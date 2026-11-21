import test from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_CONFIG, ACTIVITIES, SCHEDULE_ITEMS } from '../data/eventData';

test('Event date is officially Friday, Dec 4, 2026', () => {
  assert.equal(EVENT_CONFIG.dateDisplay, 'Friday, Dec 4, 2026');
  assert.equal(EVENT_CONFIG.eventStartIso, '2026-12-04T09:30:00+05:30');
  assert.equal(EVENT_CONFIG.timeDisplay, '9:30 AM – 4:30 PM (Daytime Fest)');
});

test('Admin data structures support dynamic modification and serialization', () => {
  // Test updating date
  const modifiedConfig = {
    ...EVENT_CONFIG,
    dateDisplay: 'Friday, Dec 4, 2026',
    venueShort: 'Main Auditorium',
  };
  const serialized = JSON.stringify(modifiedConfig);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.dateDisplay, 'Friday, Dec 4, 2026');
  assert.equal(parsed.venueShort, 'Main Auditorium');

  // Test modifying an activity coordinator
  const modifiedActivities = ACTIVITIES.map((act) =>
    act.id === 'box-cricket'
      ? { ...act, coordinatorName: 'TN Basavaraj Updated', contactNumber: '73538 73799' }
      : act
  );
  assert.equal(modifiedActivities[0].coordinatorName, 'TN Basavaraj Updated');
  assert.equal(modifiedActivities.length, 13);

  // Test modifying a schedule item
  const modifiedSchedule = SCHEDULE_ITEMS.map((item) =>
    item.id === 'inauguration'
      ? { ...item, time: '09:30 AM', title: 'Grand Inauguration' }
      : item
  );
  assert.equal(modifiedSchedule[0].time, '09:30 AM');
  assert.equal(modifiedSchedule[0].title, 'Grand Inauguration');
});
