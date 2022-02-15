import { UserEntity } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
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
