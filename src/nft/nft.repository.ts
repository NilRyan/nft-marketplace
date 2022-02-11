import { NftEntity } from 'src/nft/entities/nft.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(NftEntity)
export class NftRepository extends Repository<NftEntity> {}
