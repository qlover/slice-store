import { execSync } from 'child_process';

const codeFormatting = async () => {
  await execSync('npm run lint', { stdio: 'inherit' });
};

export const build = async () => {
  await codeFormatting();
  await execSync('npm run clean:build', { stdio: 'inherit' });
  await execSync('npx tsup', { stdio: 'inherit' });
};

export const release = async () => {
  await build();

  await execSync('release-it', { stdio: 'inherit' });
  await execSync('npm publish', { stdio: 'inherit' });
};
