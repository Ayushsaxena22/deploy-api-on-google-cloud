import type { Request, Response } from 'express';
import { createHttpApp } from './http-app';

type ExpressHandler = (req: Request, res: Response) => void;

let cachedHandlerPromise: Promise<ExpressHandler> | null = null;

async function getExpressHandler(): Promise<ExpressHandler> {
  if (!cachedHandlerPromise) {
    cachedHandlerPromise = (async () => {
      const app = await createHttpApp();
      return app.getHttpAdapter().getInstance() as ExpressHandler;
    })();
  }

  return cachedHandlerPromise;
}

// Google Cloud Functions entry point.
export const productsApi = async (req: Request, res: Response): Promise<void> => {
  const handler = await getExpressHandler();
  handler(req, res);
};