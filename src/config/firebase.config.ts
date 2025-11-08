import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
  url: process.env.FIREBASE_URL,
  key: process.env.FIREBASE_KEY,
}));

export interface FirebaseConfig {
  url: string;
  key: string;
}
