import { NftRepository } from './../nft/nft.repository';
import { NftService } from './../nft/nft.service';
import { NftModule } from './../nft/nft.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { CommentRepository } from './comments.repository';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository, NftRepository]),
    UsersModule,
    NftModule,
  ],
  providers: [CommentsResolver, CommentsService, UsersService, NftService],
})
export class CommentsModule {}
