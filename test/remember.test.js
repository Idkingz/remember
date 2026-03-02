import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const BIN = path.resolve('./bin/remember.js');

let tmpDir;

function run(...args) {
  return execFileSync(process.execPath, [BIN, ...args], {
    encoding: 'utf8',
    env: { ...process.env, HOME: tmpDir },
  });
}

function runExpectFail(...args) {
  try {
    execFileSync(process.execPath, [BIN, ...args], {
      encoding: 'utf8',
      env: { ...process.env, HOME: tmpDir },
    });
    throw new Error('Expected process to fail');
  } catch (err) {
    return err;
  }
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'remember-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('save text', () => {
  it('saves text under a keyword', () => {
    const out = run('hello world', 'greet');
    expect(out).toBe('Saved as "greet"\n');

    const stored = fs.readFileSync(path.join(tmpDir, '.remember', 'greet'), 'utf8');
    expect(stored).toBe('hello world');
  });
});

describe('save file', () => {
  it('copies an existing file under a keyword', () => {
    const srcFile = path.join(tmpDir, 'source.txt');
    fs.writeFileSync(srcFile, 'file contents here');

    const out = run(srcFile, 'myfile');
    expect(out).toBe('Saved as "myfile"\n');

    const stored = fs.readFileSync(path.join(tmpDir, '.remember', 'myfile'), 'utf8');
    expect(stored).toBe('file contents here');
  });
});

describe('retrieve', () => {
  it('prints stored content by keyword', () => {
    run('secret value', 'mykey');
    const out = run('mykey');
    expect(out).toBe('secret value');
  });
});

describe('error cases', () => {
  it('exits with code 1 for unknown keyword', () => {
    const err = runExpectFail('nonexistent');
    expect(err.status).toBe(1);
    expect(err.stderr).toContain('No entry found for "nonexistent"');
  });

  it('shows help and exits with code 1 for no arguments', () => {
    const err = runExpectFail();
    expect(err.status).toBe(1);
  });
});
