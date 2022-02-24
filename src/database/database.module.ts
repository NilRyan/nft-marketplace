// import { Module } from '@nestjs/common';
// import { ConfigService, ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         ...configService.get('database'),
//       }),
//     }),
//   ],
// })
// export class DatabaseModule {}
