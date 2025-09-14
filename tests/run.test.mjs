import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
import postcss from 'prettier/plugins/postcss';
import * as singleline from '../index.mjs';

async function formatWithPlugin(inputPath, config = {}) {
  const source = await fs.readFile(inputPath, 'utf8');
  const result = await prettier.format(source, {
    filepath: inputPath,
    plugins: [postcss, singleline],
    printWidth: 100,
    ...config,
  });
  return result.trimEnd();
}

async function readFile(file) {
  return (await fs.readFile(file, 'utf8')).trimEnd();
}

function fixtureDir(name) {
  return path.join(process.cwd(), 'tests', 'css', name);
}

describe('prettier-plugin-css-singleline', () => {
  it('single decl fits on one line', async () => {
    const dir = fixtureDir('single-decl');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('multi selectors single decl on one line when short', async () => {
    const dir = fixtureDir('multi-selectors');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('stays multi-line when exceeding printWidth', async () => {
    const dir = fixtureDir('long-exceeds');
    // Force a narrow printWidth to ensure multi-line
    const output = await formatWithPlugin(path.join(dir, 'input.css'), { printWidth: 40 });
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('does not single-line when comments present', async () => {
    const dir = fixtureDir('commented');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('never single-lines multiple declarations', async () => {
    const dir = fixtureDir('multi-decls');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('supports pseudo selectors and pseudo elements', async () => {
    const dir = fixtureDir('pseudo');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('works under at-media blocks', async () => {
    const dir = fixtureDir('at-media');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('preserves spaces around child combinator', async () => {
    const dir = fixtureDir('child-combinator');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('formats Less single decl as single line when short', async () => {
    const dir = path.join(process.cwd(), 'tests', 'less', 'single-decl');
    const output = await formatWithPlugin(path.join(dir, 'input.less'));
    const expected = await readFile(path.join(dir, 'expected.less'));
    expect(output).toBe(expected);
  });

  it('formats SCSS single decl as single line when short', async () => {
    const dir = path.join(process.cwd(), 'tests', 'scss', 'single-decl');
    const output = await formatWithPlugin(path.join(dir, 'input.scss'));
    const expected = await readFile(path.join(dir, 'expected.scss'));
    expect(output).toBe(expected);
  });

  it('prints attribute selectors on one line when short (CSS)', async () => {
    const dir = path.join(process.cwd(), 'tests', 'css', 'attribute');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('supports Less nested blocks keeping inner single decl on one line', async () => {
    const dir = path.join(process.cwd(), 'tests', 'less', 'nested');
    const output = await formatWithPlugin(path.join(dir, 'input.less'));
    const expected = await readFile(path.join(dir, 'expected.less'));
    expect(output).toBe(expected);
  });

  it('supports SCSS nested & interpolation patterns', async () => {
    const nestedDir = path.join(process.cwd(), 'tests', 'scss', 'nested');
    const nestedOut = await formatWithPlugin(path.join(nestedDir, 'input.scss'));
    const nestedExp = await readFile(path.join(nestedDir, 'expected.scss'));
    expect(nestedOut).toBe(nestedExp);

    const intDir = path.join(process.cwd(), 'tests', 'scss', 'interpolation');
    const intOut = await formatWithPlugin(path.join(intDir, 'input.scss'));
    const intExp = await readFile(path.join(intDir, 'expected.scss'));
    expect(intOut).toBe(intExp);
  });

  it('formats utility margin-top classes to single lines with shorthand decimals', async () => {
    const dir = path.join(process.cwd(), 'tests', 'css', 'utilities');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });

  it('does not manipulate blank lines beyond Prettier defaults', async () => {
    const dir = path.join(process.cwd(), 'tests', 'css', 'blank-lines');
    const output = await formatWithPlugin(path.join(dir, 'input.css'));
    const expected = await readFile(path.join(dir, 'expected.css'));
    expect(output).toBe(expected);
  });
});


