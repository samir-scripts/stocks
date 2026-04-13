const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'stocks_db',
  user: 'samirkatakamsetty',
  password: 'yeezus9090',
});

client.connect(err => {
  if (err) {
    console.error('CONNECTION ERROR:', err.message);
    process.exit(1);
  }
  console.log('Connected successfully. Running query...');

  client.query('SELECT * FROM public.raw_stocks LIMIT 5', (err, res) => {
    if (err) {
      console.error('\n❌ POSTGRES THREW AN ERROR:');
      console.error(err.message);
    } else if (res && res.rows) {
      console.log('\n✅ SUCCESS! Postgres returned rows:');
      console.log(res.rows);
    } else {
      console.error('\n❓ WEIRD RESPONSE: No error, but no rows.');
    }
    client.end();
  });
});