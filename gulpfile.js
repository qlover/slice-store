import { execSync } from 'child_process';
import dotenv from 'dotenv';
export const loadEnv = () => {
  dotenv.config();
};

export const format = async () => {
  execSync('npm run prettier', { stdio: 'inherit' });
};

export const cleanBuild = async () => {
  execSync('rimraf dist', { stdio: 'inherit' });
};

export const cleanDeep = () => {
  execSync('rimraf node_modules yarn.lock package-lock.json', {
    stdio: 'inherit'
  });
};

export const clean = async () => {
  cleanBuild();
  cleanDeep();
};

export const build = async () => {
  loadEnv();
  await format();
  await cleanBuild();
  execSync('npx tsup', { stdio: 'inherit' });
};
