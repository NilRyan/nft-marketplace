import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

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
    AssetsModule,
  ],
  providers: [CommentsResolver, CommentsService, UsersService, AssetsService],
})
export class CommentsModule {}
