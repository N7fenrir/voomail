import fs from 'fs';
import { IConfigModeContainer } from '../models/IConfig';
import { checkFileExistsSync } from '../utils';

/**
 * Config loader to load the configuration.
 */
export class ConfigLoader {
  /**
   * Loads the configuration file from the given path.
   *
   * @param configFilePath - File path to the configuration file.
   * @returns The loaded configuration.
   */
  public static load(configFilePath: string): IConfigModeContainer {
    const fileExists = checkFileExistsSync(configFilePath);
    if (!fileExists) {
      throw new Error('File Does not Exist');
    } else {
      const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
      return {
        env: config.name,
        port: config.port,
        MAIL_HOST: config.MAIL_HOST,
        MAIL_PORT: config.MAIL_PORT,
      } as IConfigModeContainer;
    }
  }
}
