import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftResolver } from './nft.resolver';
import { NftEntity } from './entities/nft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NftEntity])],
  providers: [NftResolver, NftService],
})
export class NftModule {}
