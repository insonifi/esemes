const { Pool } = require('pg');

const pool = new Pool({ host: 'sql' });
const path = process.argv[2];

if (!path) {
  console.error('requires data file');
  process.exit(255);
}

const data = require(path); // eslint-disable-line import/no-dynamic-require
const quote = val => `'${new String(val).replace("'", "''")}'`;
const itemToEntry = item => `(${Object.values(item).map(quote)})`;
const DELAY = 3e3;
const delay = period => new Promise(resolve => setTimeout(resolve, period));

(async () => {
  let client;

  while (!client) {
    try {
      await delay(DELAY);
      client = await pool.connect();
    } catch (e) {}
  }

  try {
    await client.query('BEGIN');
    await client.query(`CREATE TYPE status AS ENUM (
    	'Never', 'Once', 'Seldom', 'Often',
    	'Daily', 'Weekly', 'Monthly', 'Yearly'
    )`);
    // TODO: id -> probably should be serial type
    await client.query(`CREATE TABLE data(
    	id integer,
    	city varchar(128),
    	start_date date,
    	end_date date,
    	price money,
    	status status,
    	color varchar(7)
    )`);

    await client.query(
      `INSERT INTO data (${Object.keys(data[0])}) VALUES `
        + `${data.map(itemToEntry).toString(',\n')}`,
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
})().catch(e => console.error(e.stack));
