import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017/tickets',
  dbName: process.env.MONGODB_DB_NAME,
}));

export interface MongoConfig {
  url: string;
  dbName?: string;
}
