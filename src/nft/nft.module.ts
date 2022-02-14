import { NftRepository } from './nft.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftResolver } from './nft.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([NftRepository])],
  providers: [NftResolver, NftService],
  exports: [NftService],
})
export class NftModule {}
