import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductIdDto } from './dto/product-id.dto';
import { UpdateProductMessageDto } from './dto/update-product-message.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Handles incoming TCP messages that request product creation.
  @MessagePattern('product.create')
  create(@Payload() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  // Returns the full product list.
  @MessagePattern('product.find-all')
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // Finds one product by its numeric identifier.
  @MessagePattern('product.find-one')
  findOne(@Payload() payload: ProductIdDto): Promise<Product> {
    return this.productService.findOne(payload.id);
  }

  // Applies partial updates to an existing product.
  @MessagePattern('product.update')
  update(
    @Payload() updateProductDto: UpdateProductMessageDto,
  ): Promise<Product> {
    const { id, ...updateData } = updateProductDto;
    return this.productService.update(id, updateData);
  }

  // Removes a product from MongoDB.
  @MessagePattern('product.delete')
  remove(@Payload() payload: ProductIdDto): Promise<Product> {
    return this.productService.remove(payload.id);
  }
}
