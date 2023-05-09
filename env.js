import fs from 'fs';
import dotenv from 'dotenv';

function getAppEnvironment() {
  const prefix = 'REACT';
  return Object.keys(process.env)
    .filter((key) => new RegExp(`^${prefix}_`, 'i').test(key))
    .reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});
}

function resolveFile(file) {
  const path = fs.realpathSync(process.cwd());
  return `${path}/${file}`;
}

function getEnvFiles(production) {
  const key = production ? 'production' : 'development';

  return [resolveFile('.env'), resolveFile(`.env.${key}`)].filter(Boolean);
}

export function getEnvironment(production) {
  const dotenvFiles = getEnvFiles(production);
  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      dotenv.config({
        path: dotenvFile,
        override: true,
      });
    }
  });
  return getAppEnvironment();
}

export default getEnvironment;
