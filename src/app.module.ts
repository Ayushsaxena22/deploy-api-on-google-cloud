import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongodbUri = configService.get<string>('MONGODB_URI');

        if (!mongodbUri) {
          throw new Error('MONGODB_URI is not configured');
        }

        return {
          uri: mongodbUri,
        };
      },
    }),
    ProductModule,
  ],
})
export class AppModule {}
