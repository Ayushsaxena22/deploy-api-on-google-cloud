const { ClientProxyFactory, Transport } = require('@nestjs/microservices');
const { firstValueFrom } = require('rxjs');

async function main() {
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: process.env.MICROSERVICE_HOST ?? '127.0.0.1',
      port: Number(process.env.MICROSERVICE_PORT ?? 3001),
    },
  });

  await client.connect();

  try {
    const createdProduct = await firstValueFrom(
      client.send('product.create', {
        name: 'Postman Demo Product',
        price: 677,
        description: 'Created from the TCP client script',
      }),
    );

    console.log('Created:', createdProduct);

    const allProducts = await firstValueFrom(client.send('product.find-all', {}));
    console.log('All products:', allProducts);

    const foundProduct = await firstValueFrom(
      client.send('product.find-one', { id: createdProduct.id }),
    );
    console.log('Found:', foundProduct);

    const updatedProduct = await firstValueFrom(
      client.send('product.update', {
        id: createdProduct.id,
        name: 'Postman Demo Product Updated',
        price: 799,
        description: 'Updated from the TCP client script',
      }),
    );
    console.log('Updated:', updatedProduct);

    const deletedProduct = await firstValueFrom(
      client.send('product.delete', { id: createdProduct.id }),
    );
    console.log('Deleted:', deletedProduct);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});