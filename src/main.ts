import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { isString } from 'tcheck';
import { ExpressApp } from './utils/express_module';

function getPort(): number {
  if (isString(process.env.PORT)) {
    const envPort = Number(process.env.PORT);
    if (!Number.isNaN(envPort) && Number.isInteger(envPort)) {
      return envPort;
    }
  }

  return 3000;
}

async function startUp() {
  const app = new ExpressApp(express());

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  const port = getPort();
  app.listen(port, () => {
    console.log(`2025-02-09, Server is running on port ${port}`);
  });
}
startUp();
