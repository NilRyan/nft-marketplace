import { CommentsModule } from './../comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { AssetResolver } from './resolvers/assets.resolver';
import { AssetsRepository } from './repositories/assets.repository';
import { AssetsService } from './services/assets.service';
import { CommentsService } from '../comments/services/comments.service';
import { CommentsLoader } from '../comments/loaders/comments.loader';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetsRepository]),
    forwardRef(() => CommentsModule),
  ],
  providers: [AssetResolver, AssetsService, CommentsService, CommentsLoader],
  exports: [AssetsService, TypeOrmModule.forFeature([AssetsRepository])],
})
export class AssetsModule {}
