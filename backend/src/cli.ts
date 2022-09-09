import { Command } from 'commander';
import { dirname } from 'path';
import { version } from '../package.json';
import { ConfigLoader } from './config/ConfigLoader';
import {IConfigModeContainer} from "./models/IConfig";

const command = new Command('mail-service-backend');

interface ICmdLineArgs {
  config: string;
}

async function startServer(options: ICmdLineArgs) {
  console.log('Starting mail-service-backend...');
  getConfigFile(options.config);
}

export function getConfigFile(filepath: string): IConfigModeContainer {
  return ConfigLoader.load(filepath);
}

command
  .version(version)
  .command('start')
  .option('-c, --config <path>', 'File path to the config file', dirname(process.execPath))
  .action(async (options: ICmdLineArgs) => {
    await startServer(options);
  });

export default command;
