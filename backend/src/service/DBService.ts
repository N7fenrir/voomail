import { Client } from 'pg';

async function connectToDB(): Promise<Client> {
  try {
    const client = new Client({
      user: 'postgres',
      password: 'root',
      host: 'postgres',
      port: 5432,
      database: 'root',
    });
    await client.connect();
    return client;
  } catch (error: any) {
    console.error('DB connection failed');
    console.log(error);
    process.exit(1);
  }
}

async function exitFromDB(postgresClient: Client): Promise<void> {
  try {
    await postgresClient.end();
  } catch (error: any) {
    console.error('DB exit failed');
    console.log(error);
  }
}

async function runQuery(postgresClient: Client, query: string) {
  const res = await postgresClient.query(query);
  return res.rows;
}

export { connectToDB, exitFromDB, runQuery };
