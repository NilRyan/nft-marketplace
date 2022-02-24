import { WalletEntity } from '../../../users/entities/wallet.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { AssetEntity } from '../../../assets/entities/asset.entity';
import { UserEntity } from '../../../users/entities/user.entity';

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(UserEntity)()
      .map(async (user: UserEntity) => {
        const wallet: WalletEntity = await factory(WalletEntity)()
          .map(async (wallet: WalletEntity) => {
            wallet.owner = user;
            wallet.ownerId = user.id;
            return wallet;
          })
          .create();
        const assets: AssetEntity[] = await factory(AssetEntity)().createMany(
          5,
        );
        const walletId = wallet.id;

        user.assets = assets;
        user.wallet = wallet;
        user.walletId = walletId;
        return user;
      })
      .createMany(5);
  }
}