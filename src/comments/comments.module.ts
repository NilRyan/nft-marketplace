import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { CommentsResolver } from './resolvers/comments.resolver';
import { CommentRepository } from './repositories/comments.repository';
import { AssetsModule } from '../assets/assets.module';
import { AssetsRepository } from '../assets/assets.repository';
import { AssetsService } from '../assets/assets.service';
import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';
import { CommentsService } from './services/comments.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository, AssetsRepository]),
    UsersModule,
    forwardRef(() => AssetsModule),
  ],
  providers: [CommentsResolver, CommentsService, UsersService, AssetsService],
  exports: [CommentsService, TypeOrmModule.forFeature([CommentRepository])],
})
export class CommentsModule {}
