import { createHttpApp } from './http-app';

async function bootstrap(): Promise<void> {
  const app = await createHttpApp();
  const port = Number(process.env.PORT ?? process.env.HTTP_PORT ?? 3000);

  await app.listen(port);
}

void bootstrap();
