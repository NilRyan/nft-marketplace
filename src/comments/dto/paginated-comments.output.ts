import { Comment } from './../models/comment.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationInfo } from 'src/common/pagination-info.output';

@ObjectType()
export class PaginatedComments {
  @Field((type) => PaginationInfo)
  paginationInfo: PaginationInfo;

  @Field((type) => [Comment])
  comments: [Comment];
}
