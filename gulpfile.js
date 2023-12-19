import { execSync } from 'child_process'

const codeFormatting = async () => {
  await execSync('npm run prettier', { stdio: 'inherit' })
}

export const build = async () => {
  await codeFormatting()
  await execSync('npm run clean:build', { stdio: 'inherit' })
  await execSync('npx tsup', { stdio: 'inherit' })
}
