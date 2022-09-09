import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Client } from 'pg';
import { IConfigModeContainer } from '../models/IConfig';
import { runQuery } from './DBService';
import {
  DB_DELETE_CONTACT,
  DB_GET_ALL_CONTACTS,
  DB_GET_CONTACT_WITH_EMAIL,
  DB_INSERT_CONTACT,
  DB_UPDATE_CONTACT,
  contactPatch, DB_GET_USER_PASS
} from '../statics/SQLQueries';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';

interface IMailBody {
  content: string;
  to: string;
}

class MailService {
  private readonly config: IConfigModeContainer;
  public server!: Express;
  private readonly dbClient: Client;
  private transporter!: nodemailer.Transporter;
  private username!: string;
  private password!: string;

  constructor(config: IConfigModeContainer, dbClient: Client) {
    this.config = config;
    this.dbClient = dbClient;
    this.configureExpressApp();
  }

  private setupMailTransport() {
    this.transporter = nodemailer.createTransport({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      host: this.config.MAIL_HOST,
      port: this.config.MAIL_PORT,
      auth: {
        user: this.username,
        pass: this.password,
      },
    });
  }

  private configureExpressApp(): void {
    this.server = express();
    this.configureServer(this.server);
    this.registerEndpoints(this.server);
  }

  private configureServer(server: Express): void {
    server.use(express.json());
    server.use(
      express.urlencoded({
        extended: true,
      }),
    );
    server.use(
      cors({
        origin: '*',
      }),
    );
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(function (_request: Request, res: Response, next: NextFunction) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      next();
    });
  }

  /**
   * Function to start the server
   *
   */
  public async start(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      this.server.listen(this.config.port, () => {
        console.log('Listening to', this.config.port);
      });
    }
  }

  private registerEndpoints(server: Express): void {
    server.post('/login', async (request: Request, response: Response) => {
      const { user, pass } = request.body as Record<string, string>;
      let status;
      let message = 'Login : ';
      this.username = user;
      this.password = pass;
      const res = await this.doesAuthExists(this.username, this.password);
      this.setupMailTransport();

      if (res) {
        status = 200;
        message += 'true';
      } else {
        status = 400;
        message += 'false';
      }
      response.status(status).send(message).end();
    });

    server.post('/mail', async (request: Request, response: Response) => {
      if (!this.username && !this.password) response.status(400).send('Login First').end();
      else {
        const body: IMailBody = request.body as IMailBody;
        const chunkedArray: Record<string, string>[] = await runQuery(this.dbClient, DB_GET_ALL_CONTACTS);
        let batchesProcessed = chunkedArray.length;

        const batchEmailSent = (result: boolean, address: string) => {
          const resToSend = JSON.stringify({
            message: `Message sent to ${address} : ${result}`,
            status: result,
          });
          response.write(`${resToSend} `);
          if (--batchesProcessed == 0) {
            response.end();
          }
        };

        await Promise.all(
          chunkedArray.map(async (item: Record<string, string>) => {
            this.transporter
              .sendMail({
                from: 'me',
                to: item.contact_email,
                subject: 'test email',
                html: `Hello ${item.contact_name} \n ${body.content}`,
              })
              .then(() => {
                batchEmailSent(true, item.contact_email);
              })
              .catch(() => {
                batchEmailSent(false, item.contact_email);
              });
          }),
        );
      }
    });

    /** Contacts ***/

    server.get('/contact', async (request: Request, response: Response) => {
      if (!this.username && !this.password) response.status(400).send('Login First').end();
      else {
        const data = await runQuery(this.dbClient, DB_GET_ALL_CONTACTS);
        response.send({ contacts: data }).end();
      }
    });

    server.put('/contact/:emailAddress/:name', async (request: Request, response: Response) => {
      if (!this.username && !this.password) response.status(400).send('Login First').end();
      else {
        const { emailAddress, name } = request.params;
        let status = 500;
        let contactAdded = false;
        try {
          const exists: boolean = await this.doesContactExist(emailAddress);
          if (!exists) {
            contactAdded = await this.insertContact(emailAddress, name);
            status = 200;
          }
        } catch (e: any) {
          console.error('Error inserting the contact');
        }
        response.status(status).send(`Contact inserted: ${contactAdded}`).end();
      }
    });

    server.patch('/contact/:emailAddress', async (request: Request, response: Response) => {
      if (!this.username && !this.password) response.status(400).send('Login First').end();
      else {
        const emailAddress = request.params.emailAddress;
        const updateQuery = this.getUpdateContactQuery(
          Object.keys(contactPatch),
          request.query as Record<string, string>,
        );
        let status: number;
        let message = `Please specify what to change changeEmail or changeName`;
        if (updateQuery !== '') {
          try {
            await this.updateContact(emailAddress, updateQuery);
            status = 200;
            message = `Updated Successfully`;
          } catch (error: any) {
            status = 500;
            message = `Error doing database operation`;
          }
        } else {
          status = 400;
        }
        response.status(status).send(message).end();
      }
    });

    server.delete('/contact/:emailAddress', async (request: Request, response: Response) => {
      if (!this.username && !this.password) response.status(400).send('Login First').end();
      else {
        const emailAddress = request.params.emailAddress;
        let status = 500;
        let contactDeleted = false;
        try {
          const exists: boolean = await this.doesContactExist(emailAddress);
          if (exists) {
            contactDeleted = await this.deleteContact(emailAddress);
            status = 200;
          }
        } catch (e: any) {
          console.error('Error deleting the contact');
        }
        response.status(status).send(`${contactDeleted}`).end();
      }
    });

    /*** ------ **/
  }

  async doesAuthExists(username: string, password: string): Promise<any> {
    let rows = [];
    const checkIfUserPassExists = DB_GET_USER_PASS.replace('mailtrap-username', username).replace(
      'mailtrap-password',
      password,
    );
    try {
      rows = await runQuery(this.dbClient, checkIfUserPassExists);
    } catch (e: any) {
      console.error('Something went wrong when querying if email exists in contacts');
    }
    return rows.length > 0;
  }

  async doesContactExist(emailAddress: string): Promise<boolean> {
    let rows: any[] = [];
    const checkIfEmailExistsQuery = DB_GET_CONTACT_WITH_EMAIL.replace('emailAddress', emailAddress);
    try {
      rows = await runQuery(this.dbClient, checkIfEmailExistsQuery);
    } catch (e: any) {
      console.error('Something went wrong when querying if email exists in contacts');
    }
    return rows.length > 0;
  }

  async deleteContact(emailAddress: string): Promise<boolean> {
    const query = DB_DELETE_CONTACT.replace('emailAddress', emailAddress);
    return await this.runQueryInDB(query);
  }

  async insertContact(emailAddress: string, name: string): Promise<boolean> {
    const query = DB_INSERT_CONTACT.replace('emailAddress', emailAddress).replace('contactName', name);
    return await this.runQueryInDB(query);
  }

  async updateContact(emailAddress: string, updateQuery: string): Promise<boolean> {
    const query: string = DB_UPDATE_CONTACT.replace('emailAddress', emailAddress).replace('condition', updateQuery);
    return await this.runQueryInDB(query);
  }

  async runQueryInDB(query: string): Promise<boolean> {
    let data = false;
    try {
      await runQuery(this.dbClient, query);
      data = true;
    } catch (error: any) {
      console.error(error);
    }
    return data;
  }

  getUpdateContactQuery(keys: string[], data: Record<string, string>): string {
    let updateQuery = '';
    if (keys.length === 0) {
      return updateQuery;
    }
    keys.forEach((key: string) => {
      if (key in data) {
        updateQuery += `${this.replaceItem(key, data[key], contactPatch[key])} `;
      }
    });
    return updateQuery;
  }

  replaceItem(toReplace: string, replaceBy: string, mainString: string): string {
    let res = '';
    if (mainString.includes(toReplace)) {
      res = mainString.replace(toReplace, replaceBy);
    }
    return res;
  }
}

export default MailService;
