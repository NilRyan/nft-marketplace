import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { CommentsResolver } from './resolvers/comments.resolver';
import { CommentsRepository } from './repositories/comments.repository';
import { AssetsModule } from '../assets/assets.module';
import { AssetsRepository } from '../assets/repositories/assets.repository';
import { AssetsService } from '../assets/services/assets.service';
import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';
import { CommentsService } from './services/comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsRepository, AssetsRepository]),
    UsersModule,
    forwardRef(() => AssetsModule),
  ],
  providers: [CommentsResolver, CommentsService, UsersService, AssetsService],
  exports: [CommentsService, TypeOrmModule.forFeature([CommentsRepository])],
})
export class CommentsModule {}
