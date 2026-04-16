import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Model, isValidObjectId } from 'mongoose';
import { ProductDocument, ProductSchemaName } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductSchemaName)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // Converts a MongoDB document into the API response shape.
  private toProductResponse(productDocument: ProductDocument): Product {
    const plainProduct = productDocument.toObject();

    return {
      id: productDocument._id.toString(),
      name: plainProduct.name,
      price: plainProduct.price,
      description: plainProduct.description,
      createdAt: plainProduct.createdAt ?? new Date(),
    };
  }

  private ensureValidId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid product id: ${id}`);
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = await this.productModel.create(createProductDto);
    return this.toProductResponse(createdProduct);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().sort({ createdAt: -1 }).exec();
    return products.map((product: ProductDocument) => this.toProductResponse(product));
  }

  async findOne(id: string): Promise<Product> {
    this.ensureValidId(id);

    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.toProductResponse(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    this.ensureValidId(id);

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, { $set: updateProductDto }, { new: true, runValidators: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.toProductResponse(updatedProduct);
  }

  async remove(id: string): Promise<Product> {
    this.ensureValidId(id);

    const removedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!removedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.toProductResponse(removedProduct);
  }
}
