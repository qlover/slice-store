const { execSync } = require('child_process');
const { loadEnv } = require('../loadEnv');

function runCommand(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    process.exit(1);
  }
}

function main() {
  loadEnv();
  // 安装依赖
  // console.log('Installing dependencies...');
  // runCommand('yarn install --frozen-lockfile');

  // 构建项目
  // console.log('Building project...');
  // runCommand('yarn workspaces run build');

  // 设置 npm 认证令牌
  if (!process.env.NPM_TOKEN) {
    console.error('NPM_TOKEN environment variable is not set.');
    process.exit(1);
  }
  runCommand(
    `echo "//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}" > .npmrc`
    // `npm config set //registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`
  );

  // 发布到 npm 和 GitHub
  console.log('Publishing to npm and GitHub...');
  runCommand('npx release-it --ci', {
    env: {
      ...process.env,
      NPM_TOKEN: process.env.NPM_TOKEN
    }
  });
}

main();
