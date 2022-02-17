import { CommentsService } from 'src/comments/services/comments.service';
import { CommentsModule } from './../comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { AssetResolver } from './assets.resolver';
import { AssetsRepository } from './assets.repository';
import { AssetsService } from './assets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetsRepository]),
    forwardRef(() => CommentsModule),
  ],
  providers: [AssetResolver, AssetsService, CommentsService],
  exports: [AssetsService, TypeOrmModule.forFeature([AssetsRepository])],
})
export class AssetsModule {}
