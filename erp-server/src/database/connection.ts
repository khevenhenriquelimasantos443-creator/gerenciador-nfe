import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'erp_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 15, // Exatamente 15 para suportar 15 usuários simultâneos
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool:', err);
});

export async function initDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    // Executar schema.sql
    const fs = require('fs');
    const schemaPath = __dirname + '/schema.sql';
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('🔄 Inicializando banco de dados...');
    await client.query(schema);
    console.log('✅ Banco de dados pronto!');
  } catch (err) {
    console.error('❌ Erro ao inicializar banco:', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getConnection(): Promise<PoolClient> {
  return pool.connect();
}

export async function query(sql: string, params?: any[]) {
  return pool.query(sql, params);
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
