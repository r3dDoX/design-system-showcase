import * as fs from 'fs';

const paths = fs.readdirSync('./src/assets/icons');
const icons = paths.filter(p => p.includes('included')).map(p => p.replace('.included.svg', ''));
const content = `export const ICONS = ${JSON.stringify(icons)}  as const;
export type Icons = typeof ICONS[number];`;

fs.writeFileSync('./src/components/icon/icons.ts', content);