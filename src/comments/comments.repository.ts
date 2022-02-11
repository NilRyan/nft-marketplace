import { CommentEntity } from 'src/comments/entities/comment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {}
