const { spawn } = require('child_process')

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'start'], {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

child.on('error', (error) => {
  console.error('Failed to start Next.js server:', error)
  process.exit(1)
})
