import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const frontendPorts = Array.from({ length: 11 }, (_, index) => 3000 + index);
const processes = [];

const existingBackend = await isBackendRunning();
if (existingBackend) {
  console.log('Backend already running at http://localhost:5000');
} else {
  processes.push(start('backend', resolve(root, 'backend')));
}

const existingFrontend = await findFrontend();
if (existingFrontend) {
  console.log(`Frontend already running at ${existingFrontend}`);
} else {
  processes.push(start('frontend', resolve(root, 'frontend')));
}

if (processes.length === 0) {
  console.log('RevealU dev servers are already running.');
}

function start(name, cwd) {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      stopAll();
      process.exit(code);
    }
  });

  return child;
}

async function isBackendRunning() {
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      signal: AbortSignal.timeout(1200)
    });
    const payload = await response.json();
    return payload?.service === 'revealu-auth-api';
  } catch {
    return false;
  }
}

async function findFrontend() {
  for (const port of frontendPorts) {
    try {
      const response = await fetch(`http://localhost:${port}/login`, {
        signal: AbortSignal.timeout(1200)
      });
      if (response.ok) {
        return `http://localhost:${port}`;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function stopAll() {
  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});
