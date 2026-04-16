import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const ProductSchemaName = 'Product';

@Schema({ timestamps: true })
export class ProductSchemaClass {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ default: '' })
  description?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export type ProductDocument = HydratedDocument<ProductSchemaClass>;

export const ProductSchema = SchemaFactory.createForClass(ProductSchemaClass);

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_document, returnedObject) => {
    const transformedObject = returnedObject as {
      _id?: { toString(): string };
      id?: string;
    };

    transformedObject.id = transformedObject._id?.toString() ?? '';
    delete transformedObject._id;
  },
});