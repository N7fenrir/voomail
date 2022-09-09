import { Command } from 'commander';
import { dirname } from 'path';
import { version } from '../package.json';
import { IConfigModeContainer } from './models/IConfig';
import { ConfigLoader } from './config/ConfigLoader';
import MailService from './service/MailService';
import { connectToDB } from './service/DBService';

const command = new Command('mail-service-backend');

interface ICmdLineArgs {
  config: string;
}

async function startServer(options: ICmdLineArgs) {
  console.log('Starting mail-service-backend...');
  const config = getConfigFile(options.config);
  const dbClient = await connectToDB();
  const mailService = new MailService(config, dbClient);
  await mailService.start();
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
