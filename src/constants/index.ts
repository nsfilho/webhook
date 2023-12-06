import { join } from 'path';

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
export const WORKSPACE =
    process.env.WORKSPACE || join(__dirname, '..', '..', 'workspace');

export const TOKEN = process.env.TOKEN || 'secret';
