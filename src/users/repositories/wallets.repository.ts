import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { WalletEntity } from '../entities/wallet.entity';

@EntityRepository(WalletEntity)
export class WalletRepository extends Repository<WalletEntity> {
  async createWallet(owner: UserEntity) {
    const wallet = await this.create({
      owner,
      ownerId: owner.id,
    });
    return await this.save(wallet);
  }
}
