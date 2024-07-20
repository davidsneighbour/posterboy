import { mergeConfigs, loadAndMergeConfig } from './toml.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, jest, test } from '@jest/globals';

jest.mock('fs');

describe('mergeConfigs', () => {
  test('merges default and user configs correctly', () => {
    const defaultConfig = {
      userAgent: 'posterboy/v0.0.1',
      sources: [
        { slug: 'defaultSource', type: 'feed', url: 'https://default.feed/rss.xml', name: 'Default Feed' }
      ],
      targets: [
        { slug: 'defaultTarget', type: 'discord', name: 'Default Discord', hook: 'https://discord.default/webhook', template: 'Default template' }
      ]
    };

    const userConfig = {
      sources: [
        { slug: 'userSource', type: 'github', repo: 'user/repo', name: 'User Repo' }
      ],
      targets: [
        { slug: 'defaultTarget', type: 'discord', name: 'Overridden Discord', hook: 'https://discord.override/webhook', template: 'Overridden template' }
      ]
    };

    const expectedConfig = {
      userAgent: 'posterboy/v0.0.1',
      sources: [
        { slug: 'defaultSource', type: 'feed', url: 'https://default.feed/rss.xml', name: 'Default Feed' },
        { slug: 'userSource', type: 'github', repo: 'user/repo', name: 'User Repo' }
      ],
      targets: [
        { slug: 'defaultTarget', type: 'discord', name: 'Overridden Discord', hook: 'https://discord.override/webhook', template: 'Overridden template' }
      ]
    };

    const mergedConfig = mergeConfigs(defaultConfig, userConfig);
    expect(mergedConfig).toEqual(expectedConfig);
  });
});
