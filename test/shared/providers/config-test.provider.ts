import { ConfigService } from '@nestjs/config';

export const ConfigTestProvider = {
  provide: ConfigService,
  useValue: {
    get: jest.fn((key: string) => {
      if (key === 'frontend') return { url: process.env.FRONTEND_URL };
      if (key === 'supabase')
        return { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_KEY };
      if (key === 'cloudinary')
        return {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        };
      return undefined;
    }),
  },
};
