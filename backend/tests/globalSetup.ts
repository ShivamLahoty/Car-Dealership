import fs from 'fs';

export default function () {
  fs.readdirSync('.')
    .filter((file) => file.startsWith('test') && file.endsWith('.db'))
    .forEach((file) => fs.rmSync(file, { force: true }));
}