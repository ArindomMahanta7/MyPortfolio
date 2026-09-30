import morgan from 'morgan';
import { env } from './env.js';
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
const logger = morgan(format, { 
  skip: (req) =>
    process.env.NODE_ENV === 'production' && req.originalUrl === '/api/health',
});
export default logger;