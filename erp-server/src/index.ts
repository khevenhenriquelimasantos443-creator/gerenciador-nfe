import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initDatabase, closePool } from './database/connection';
import routes from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Erro interno' : err.message,
    timestamp: new Date()
  });
});

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    timestamp: new Date()
  });
});

// Start server
async function start() {
  try {
    console.log('🚀 Iniciando ERP Faturador...');

    // Inicializar banco de dados
    await initDatabase();

    // Iniciar servidor Express
    app.listen(port, () => {
      console.log(`✅ Servidor rodando em http://localhost:${port}`);
      console.log(`📊 API: http://localhost:${port}/api`);
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await closePool();
  process.exit(0);
});

start();

export default app;
