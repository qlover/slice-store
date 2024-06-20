const dotenv = require('dotenv');
const path = require('path');

function loadEnv() {
  // 加载 .env.local 文件
  const envLocalPath = path.resolve(__dirname, '../.env.local');
  const envLocalResult = dotenv.config({ path: envLocalPath });
  if (envLocalResult.error) {
    console.warn(`.env.local not found or failed to load`);
  }

  // 加载 .env 文件
  const envPath = path.resolve(__dirname, '../.env');
  const envResult = dotenv.config({ path: envPath });
  if (envResult.error) {
    console.warn(`.env not found or failed to load`);
  }
}

loadEnv();
