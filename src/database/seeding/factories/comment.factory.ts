import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { CommentEntity } from './../../../comments/entities/comment.entity';

define(CommentEntity, (faker: typeof Faker) => {
  const comment = new CommentEntity();
  comment.comment = faker.lorem.sentence();
  return comment;
});
