import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { pipeline } from 'stream/promises';
import { config as dotenvConfig } from 'dotenv';
import { promisify } from 'util';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { consola } from 'consola';

/**
 * Loads a feed from the given URL and parses it
 *
 * @param   {String}  feedLink  URL of the feed to load
 * @returns {Promise}           Promise object representing the parsed feed
 */
export async function loadFeed(feedLink) {
  try {
    const response = await fetch(feedLink);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    const cleanedXmlData = xmlData.replace('\ufeff', '');
    const data = await parseStringPromise(cleanedXmlData);
    return data;
  } catch (error) {
    consola.error('Error loading feed:', error);
    throw error;
  }
}

/**
 * Downloads an image from the given URL and stores it locally
 *
 * @param {String} imageUrl       URL of the image to download
 * @param {String} localFilePath  Local path where to store the image
 */
export async function downloadImage(imageUrl, localFilePath) {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`HTTP error while downloading image! Status: ${response.status}`);
    }

    const fileStream = fs.createWriteStream(localFilePath);
    await pipeline(response.body, fileStream);
  } catch (error) {
    consola.error('Error downloading image:', error);
    throw error;
  }
}

/**
 * Loading the .env file using async/await
 *
 * @todo find out why it doesn't work without this
 */
export const loadEnv = async () => {
  try {
    const envFileContent = await fsPromises.readFile('.env', 'utf8');
    //consola.log(envFileContent);
    dotenvConfig({ path: '.env' });
    //consola.log(process.env);
  } catch (error) {
    consola.error('Error loading .env file:', error);
  }
};

/**
 * Promisifying the fs module
 */
export const readFileSync = async () => { promisify(fs.readFile); }
export const writeFileSync = async () => { promisify(fs.writeFile); }

/**
 * Creates a message by replacing placeholders in the template string with
 * corresponding properties from the item object.
 *
 * @param {Object} config - Configuration object containing the template string.
 * @param {Object} item - Item object containing properties to replace in the template.
 * @returns {string} - The generated message with placeholders replaced by item properties.
 * @throws {Error} - Throws an error if there are missing variables in the template string.
 */
export function createMessage(config, item) {
  const template = config.template;
  const missingVariables = [];

  const message = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, p1) => {
    if (item[p1] !== undefined) {
      return item[p1];
    } else {
      missingVariables.push(p1);
      return match;
    }
  });

  if (missingVariables.length > 0) {
    console.error(`Error: Missing variables in template - ${missingVariables.join(', ')}`);
  }

  return message;
}
