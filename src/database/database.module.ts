import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES__HOST'),
        port: configService.get('POSTGRES__PORT'),
        username: configService.get('POSTGRES__USER'),
        password: configService.get('POSTGRES__PASSWORD'),
        database: configService.get('POSTGRES__DB'),
        entities: [__dirname + '/**/*.entity.ts'],
        autoLoadEntities: true,
        logging: true,
        synchronize: true, // disable in production
      }),
    }),
  ],
})
export class DatabaseModule {}
