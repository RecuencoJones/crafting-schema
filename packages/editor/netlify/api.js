import serverless from 'serverless-http';
import { handler as _handler } from '../api';

export const handler = serverless(_handler);
