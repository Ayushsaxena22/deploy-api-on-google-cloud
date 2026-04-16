# NestJS Product Serverless API

A NestJS CRUD API for products, designed for Google Cloud Functions with MongoDB Atlas.

## What Changed

- HTTP-only backend for serverless deployment
- Google Cloud Functions entry point in `src/index.ts`
- Shared Nest bootstrap for local dev and Cloud Functions
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
  http-app.ts
  index.ts
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
    product.http.controller.ts
    product.service.ts
    product.module.ts
```

## Run Locally

```bash
npm install
npm run start:dev
```

The local app listens on `http://localhost:3000/api`.

## Google Cloud Functions Deployment

Deploy the HTTP function entry point named `productsApi`:

```bash
gcloud functions deploy productsApi \
  --gen2 \
  --runtime nodejs18 \
  --region us-central1 \
  --source . \
  --entry-point productsApi \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=<your-mongodb-atlas-uri>
```

The function URL returned by Google Cloud is the URL you use in Postman.

## REST Endpoints

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

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

## Notes

- The app reuses a cached Nest instance between Cloud Function invocations.
- MongoDB connection pooling is kept small because Cloud Functions are stateless and scale horizontally.
