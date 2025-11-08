// Minimal manual mock for firebase-admin used in tests.
const mockAuth = {
  async verifyIdToken(token) {
    // simple behavior: if token contains 'good' return uid, else throw
    if (!token || token.includes('bad') || token.includes('expired')) {
      throw new Error('invalid token');
    }
    return {
      uid: token === 'good_token' || token === 'good' ? 'uid-1' : token,
    };
  },
  async getUser(uid) {
    return { uid, email: `${uid}@example.com` };
  },
  async getUserByEmail(email) {
    // For tests we can simulate not-found by throwing
    if (email === 'exists@example.com') return { uid: 'exists-uid', email };
    throw new Error('user-not-found');
  },
  async createUser({ email, password }) {
    return { uid: `u-${Math.random().toString(16).slice(2)}`, email };
  },
  revokeRefreshTokens(uid) {
    return Promise.resolve();
  },
};

module.exports = {
  initializeApp: () => ({}),
  credential: {
    cert: () => ({}),
    applicationDefault: () => ({}),
  },
  auth: () => mockAuth,
  firestore: () => ({}),
};
