const Koa = require('koa');
const serve = require('koa-static');
const route = require('koa-route');
const { Pool } = require('pg');

const PORT = process.env.PORT;

const app = new Koa();
const pool = new Pool({ host: 'sql' });
const formatDate = date => new Date(parseInt(date)).toLocaleDateString('en-US');

async function getDataRange(ctx, start = 0, end = Date.now()) {
  const { limit = 1000, offset = 0 } = ctx.query;
  const client = await pool.connect();

  console.log('[get] %d…%d', start, end);

  try {
    const { rows } = await client.query(
      "SELECT id, city, to_char(start_date, 'MM/DD/YYYY') AS \"startDate\", "
        + "to_char(end_date, 'MM/DD/YYYY') AS \"endDate\", "
        + 'price::numeric, status, color '
        + 'FROM data WHERE start_date > $1 AND end_date < $2 LIMIT $3 OFFSET $4',
      [formatDate(start), formatDate(end), limit, offset],
    );

    ctx.response.body = rows;
    ctx.response.status = 200;
  } catch (e) {
    ctx.response.status = 500;
    console.log(e.stack);
  } finally {
    client.release();
  }
}

app.use(serve(process.argv[2]));
app.use(route.get('/data', getDataRange));
app.use(route.get('/data/:start/:end', getDataRange));

app.listen(PORT);
console.log('Ready at http://localhost:%d/', PORT);
