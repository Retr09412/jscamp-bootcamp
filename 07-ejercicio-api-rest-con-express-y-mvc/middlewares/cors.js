import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:1234',
  'https://midu.dev',
  'http://jscamp.dev',
  'http://localhost:5173'
];

export const corsMiddleware = ({accepted_origins = ACCEPTED_ORIGINS} = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (accepted_origins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed'));
    }
  });
}

