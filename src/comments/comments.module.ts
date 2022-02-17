import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { CommentsResolver } from './resolvers/comments.resolver';
import { CommentRepository } from './repositories/comments.repository';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/services/users.service';
import { CommentsService } from './services/comments.service';
import { AssetsModule } from 'src/assets/assets.module';
import { AssetsRepository } from 'src/assets/assets.repository';
import { AssetsService } from 'src/assets/assets.service';

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
