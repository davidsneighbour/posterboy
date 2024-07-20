import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { pipeline } from 'stream/promises';
import { config as dotenvConfig } from 'dotenv';
import { consola } from 'consola';
import fs, { promises as fsPromises } from 'fs';
import { loadFeed, downloadImage, loadEnv, createMessage } from './utils.mjs';
import { jest } from '@jest/globals'

// Mocking fetch from node-fetch
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mocking consola
jest.mock('consola');

// Mocking stream/promises pipeline
jest.mock('stream/promises', () => ({
  pipeline: jest.fn()
}));

// Mocking xml2js parseStringPromise
jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn()
}));

// Mocking dotenv config
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Mocking fs.promises
fsPromises.readFile = jest.fn();



describe('createMessage', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should create a message by replacing placeholders', () => {
    const config = { template: 'Hello {{ name }}!' };
    const item = { name: 'World' };

    const result = createMessage(config, item);
    expect(result).toBe('Hello World!');
  });

  it('should log an error if there are missing variables', () => {
    const config = { template: 'Hello {{ name }} and {{ missing }}!' };
    const item = { name: 'World' };

    const result = createMessage(config, item);
    expect(result).toBe('Hello World and {{ missing }}!');
    expect(console.error).toHaveBeenCalledWith('Error: Missing variables in template - missing');
  });
});
