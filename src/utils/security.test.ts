import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSha256,
  verifyAdminCredentials,
  AUTH_HASH_CONFIG,
} from './security';

test('computeSha256 generates valid 64-char hexadecimal hash', async () => {
  const hash = await computeSha256('hello');
  // SHA-256 of 'hello' is 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
  assert.equal(hash, '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
});

test('verifyAdminCredentials authenticates correct admin credentials via SHA-256', async () => {
  const isValid = await verifyAdminCredentials('admin', 'synora2026');
  assert.equal(isValid, true);

  const isValidCaseInsensitive = await verifyAdminCredentials('  ADMIN  ', 'synora2026');
  assert.equal(isValidCaseInsensitive, true);
});

test('verifyAdminCredentials rejects incorrect credentials', async () => {
  const wrongUser = await verifyAdminCredentials('student', 'synora2026');
  assert.equal(wrongUser, false);

  const wrongPass = await verifyAdminCredentials('admin', 'wrongpass123');
  assert.equal(wrongPass, false);
});

test('AUTH_HASH_CONFIG does not contain plaintext password string', () => {
  const configString = JSON.stringify(AUTH_HASH_CONFIG);
  assert.equal(configString.includes('synora2026'), false);
  assert.equal(AUTH_HASH_CONFIG.passHash.length, 64);
});
