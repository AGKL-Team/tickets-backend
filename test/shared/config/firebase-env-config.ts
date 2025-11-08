export const configureFirebaseEnv = () => {
  // Firebase-compatible test envs (kept for backward compatibility)
  // A minimal fake service account JSON string (tests mock firebase-admin)
  process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
    project_id: 'fake-project',
    client_email: 'test@fake-project.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nFAKE\n-----END PRIVATE KEY-----',
  });
  process.env.FIREBASE_API_KEY = 'fake-api-key';
  // New env names requested: FIREBASE_URL and FIREBASE_KEY (set in tests too)
  process.env.FIREBASE_URL =
    process.env.FIREBASE_URL || 'https://fake-url.firebase.co';
  process.env.FIREBASE_KEY = process.env.FIREBASE_KEY || 'fake-key';
};
