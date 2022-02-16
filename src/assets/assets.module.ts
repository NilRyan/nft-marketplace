import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AssetResolver } from './assets.resolver';
import { AssetsRepository } from './assets.repository';
import { AssetsService } from './assets.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetsRepository])],
  providers: [AssetResolver, AssetsService],
  exports: [AssetsService, TypeOrmModule.forFeature([AssetsRepository])],
})
export class AssetsModule {}
