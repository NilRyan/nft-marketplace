import { Comment } from './../models/comment.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationInfo } from '../../common/pagination-filtering/pagination-info.output';

@ObjectType()
export class PaginatedComments {
  @Field((type) => PaginationInfo, {
    nullable: true,
  })
  paginationInfo?: PaginationInfo;

  @Field((type) => [Comment], { nullable: true })
  comments?: [Comment];
}
