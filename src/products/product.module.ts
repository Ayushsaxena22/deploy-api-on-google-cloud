import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductHttpController } from './product.http.controller';
import { ProductSchema, ProductSchemaName } from './schemas/product.schema';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaName, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductController, ProductHttpController],
  providers: [ProductService],
})
export class ProductModule {}
