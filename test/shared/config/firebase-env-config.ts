export const configureFirebaseEnv = () => {
  // Firebase-compatible test envs (kept for backward compatibility)
  // A minimal fake service account JSON string (tests mock firebase-admin)
  process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
    project_id: 'fake-project',
    client_email: 'test@fake-project.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nFAKE\n-----END PRIVATE KEY-----',
  });
  process.env.FIREBASE_API_KEY = 'fake-api-key';
  // New env names requested: set the web app / Firebase project values used by SDKs
  process.env.FIREBASE_AUTH_DOMAIN =
    process.env.FIREBASE_AUTH_DOMAIN || 'fake-project.firebaseapp.com';
  process.env.FIREBASE_PROJECT_ID =
    process.env.FIREBASE_PROJECT_ID || 'fake-project';
  process.env.FIREBASE_STORAGE_BUCKET =
    process.env.FIREBASE_STORAGE_BUCKET || 'fake-project.appspot.com';
  process.env.FIREBASE_MESSAGING_SENDER_ID =
    process.env.FIREBASE_MESSAGING_SENDER_ID || 'fake-sender-id';
  process.env.FIREBASE_APP_ID =
    process.env.FIREBASE_APP_ID || '1:fake:web:fake';
  process.env.FIREBASE_MEASUREMENT_ID =
    process.env.FIREBASE_MEASUREMENT_ID || 'G-FAKEID';
};
