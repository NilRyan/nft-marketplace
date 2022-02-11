import { ObjectType, Field, Int } from '@nestjs/graphql';
import { type } from 'os';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Nft {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  imageUrl: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ type: 'bigint' })
  price: string;

  @Field()
  @Column()
  comments: string[];

  @Column()
  isDeleted: boolean;

  @Field()
  @Column()
  category: string;

  @Field()
  @Column()
  owner: string;
}
