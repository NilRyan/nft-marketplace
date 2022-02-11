import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { CommentRepository } from './comments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentRepository])],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
