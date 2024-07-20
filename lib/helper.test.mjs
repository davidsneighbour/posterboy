import { transformConfig, getObjectBySlug } from './helper.mjs';
import { expect, jest, test } from '@jest/globals';

describe('transformConfig', () => {
  test('transforms config array into select options', () => {
    const configArray = [
      { slug: 'source1', name: 'Source 1', type: 'feed', url: 'https://source1.com/rss' },
      { slug: 'source2', name: 'Source 2', type: 'github', repo: 'user/repo2' },
    ];

    const expectedOutput = [
      { value: 'source1', label: 'Source 1' },
      { value: 'source2', label: 'Source 2' },
    ];

    const result = transformConfig(configArray);
    expect(result).toEqual(expectedOutput);
  });

  test('returns an empty array if config array is empty', () => {
    const configArray = [];
    const expectedOutput = [];
    const result = transformConfig(configArray);
    expect(result).toEqual(expectedOutput);
  });
});

describe('getObjectBySlug', () => {
  test('returns the object with the matching slug', () => {
    const configArray = [
      { slug: 'source1', name: 'Source 1', type: 'feed', url: 'https://source1.com/rss' },
      { slug: 'source2', name: 'Source 2', type: 'github', repo: 'user/repo2' },
    ];

    const slug = 'source2';
    const expectedOutput = { slug: 'source2', name: 'Source 2', type: 'github', repo: 'user/repo2' };
    const result = getObjectBySlug(configArray, slug);
    expect(result).toEqual(expectedOutput);
  });

  test('returns undefined if no object with the matching slug is found', () => {
    const configArray = [
      { slug: 'source1', name: 'Source 1', type: 'feed', url: 'https://source1.com/rss' },
      { slug: 'source2', name: 'Source 2', type: 'github', repo: 'user/repo2' },
    ];

    const slug = 'source3';
    const result = getObjectBySlug(configArray, slug);
    expect(result).toBeUndefined();
  });

  test('returns undefined if config array is empty', () => {
    const configArray = [];
    const slug = 'source1';
    const result = getObjectBySlug(configArray, slug);
    expect(result).toBeUndefined();
  });
});
