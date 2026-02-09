import { cpSync, mkdirSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');
const distDir = join(process.cwd(), 'dist');

mkdirSync(distDir, { recursive: true });
cpSync(publicDir, distDir, { recursive: true });
console.log('Copiado public/ -> dist/');
