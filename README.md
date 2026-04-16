# NestJS Product Microservice CRUD API

A minimal NestJS microservice that exposes Product CRUD operations over TCP transport and persists data in MongoDB Atlas.

## Architecture

- NestJS microservice application
- HTTP REST API on port `3000`
- TCP transport on port `3001`
- Modular Product feature module
- MongoDB Atlas via Mongoose
- DTO validation with `class-validator`

## Environment

Create a `.env` file in the project root and set:

```bash
MONGODB_URI=your-mongodb-atlas-connection-string
```

## Project Structure

```text
src/
  app.module.ts
  main.ts
  products/
    dto/
      create-product.dto.ts
      product-id.dto.ts
      update-product.dto.ts
    entities/
      product.entity.ts
    schemas/
      product.schema.ts
    product.controller.ts
    product.service.ts
    product.module.ts
```

## Run the service

**Local development:**
```bash
npm install
npm run start:dev
```

**Production build:**
```bash
npm install
npm start
```

By default, the HTTP API listens on `http://localhost:3000` and the TCP microservice listens on `127.0.0.1:3001`.

## Google Cloud Run Deployment

Set the `MONGODB_URI` environment variable in Cloud Run, then deploy:

```bash
gcloud run deploy nestjs-product-api \
  --source . \
  --runtime nodejs18 \
  --port 3000 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=<your-mongodb-atlas-uri>
```

The `postinstall` script automatically builds the project during deployment.

## REST URLs for Postman

- `POST http://127.0.0.1:3000/products`
- `GET http://127.0.0.1:3000/products`
- `GET http://127.0.0.1:3000/products/:id`
- `PATCH http://127.0.0.1:3000/products/:id`
- `DELETE http://127.0.0.1:3000/products/:id`

## Message Patterns

- `product.create`
- `product.find-all`
- `product.find-one`
- `product.update`
- `product.delete`

## Sample Request Payloads

### Create Product

```json
{
  "name": "Wireless Mouse",
  "price": 29.99,
  "description": "Ergonomic mouse with USB receiver"
}
```

### Get All Products

```json
{}
```

### Get Product by ID

```json
{
  "id": "67f7a1e2f8f3ad1e8a123456"
}
```

### Update Product

```json
{
  "name": "Wireless Mouse Pro",
  "price": 34.99,
  "description": "Updated ergonomic mouse"
}
```

### Delete Product

```json
{
  "id": "67f7a1e2f8f3ad1e8a123456"
}
```

## TCP Client Script

Run the Node client to exercise the TCP message patterns end to end:

```bash
npm run tcp:client
```

It will create, list, fetch, update, and delete a product using the microservice transport.

## Example TCP Client Usage

```ts
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

const client = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 3001,
  },
});

client.send('product.find-all', {}).subscribe(console.log);
```
