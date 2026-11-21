import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVITIES, COORDINATORS, EVENT_CONFIG } from '../data/eventData';

test('Synora 2K26 event configuration has correct daytime metadata', () => {
  assert.equal(EVENT_CONFIG.brandName, 'Synora 2K26');
  assert.equal(EVENT_CONFIG.collegeName, 'Kishkinda University');
  assert.equal(EVENT_CONFIG.department, 'Department of AI & Machine Learning');
  assert.equal(EVENT_CONFIG.venueShort, 'Auditorium');
  assert.match(EVENT_CONFIG.batchLabel, /26–30|2026–2030/);
  // Ensure no night references exist in event config
  const configString = JSON.stringify(EVENT_CONFIG).toLowerCase();
  assert.equal(configString.includes('night'), false);
  assert.equal(configString.includes('afterparty'), false);
  assert.equal(configString.includes('midnight'), false);
});

test('exactly 13 activities are present and strictly omit section tags (A/s) and (B/s)', () => {
  assert.equal(ACTIVITIES.length, 13);
  assert.equal(COORDINATORS.length, 13);

  // Expected 13 events and coordinators from user specification
  const expectedMap: Record<string, { coordinator: string; contact: string }> = {
    'Box Cricket': { coordinator: 'TN Basavaraj', contact: '73538 73799' },
    'Tug of War': { coordinator: 'Vinay', contact: '82172 68731' },
    'Photography': { coordinator: 'Shashank B', contact: '88848 50277' },
    'Hidden Chapters': { coordinator: 'Mythri', contact: '83411 00569' },
    'Carrom': { coordinator: 'Prashant K', contact: '99721 38543' },
    'Dance': { coordinator: 'Nageshwari P', contact: '80959 82881' },
    '3 Stage Showdown': { coordinator: 'Shashank A', contact: '90197 59515' },
    'Ramp Walk': { coordinator: 'Sai Sree', contact: '76609 44609' },
    'Mono Act': { coordinator: 'Lahari', contact: '76765 82264' },
    'Reel Making': { coordinator: 'Amanath Ali Khan', contact: '73377 99633' },
    'Drawing & Painting': { coordinator: 'Navya Sree', contact: '93816 27033' },
    'Mind Games': { coordinator: 'Charan Tej', contact: '91087 71828' },
    'Free Fire': { coordinator: 'Pritam', contact: '83106 46670' },
  };

  for (const act of ACTIVITIES) {
    // Assert no (A/s) or (B/s)
    assert.equal(act.coordinatorName.includes('(A/s)'), false);
    assert.equal(act.coordinatorName.includes('(B/s)'), false);
    assert.equal(act.coordinatorName.includes('A/s'), false);
    assert.equal(act.coordinatorName.includes('B/s'), false);

    // Verify contact raw format
    assert.match(act.contactRaw, /^91\d{10}$/);

    // Verify expected coordinator
    const expected = expectedMap[act.title];
    assert.ok(expected, `Unknown activity: ${act.title}`);
    assert.equal(act.coordinatorName.toLowerCase(), expected.coordinator.toLowerCase());
    assert.equal(act.contactNumber, expected.contact);
  }
});
