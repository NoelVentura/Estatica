import { cpSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');
const distDir = join(process.cwd(), 'dist');

mkdirSync(distDir, { recursive: true });
cpSync(publicDir, distDir, { recursive: true });
writeFileSync(join(distDir, '.nojekyll'), '', 'utf8');
console.log('Copiado public/ -> dist/');
