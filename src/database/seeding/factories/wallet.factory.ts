import * as Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { UserEntity } from '../../../users/entities/user.entity';
import { WalletEntity } from '../../../users/entities/wallet.entity';

define(WalletEntity, (faker: typeof Faker) => {
  const wallet = new WalletEntity();
  wallet.balance = 20000;
  return wallet;
});
