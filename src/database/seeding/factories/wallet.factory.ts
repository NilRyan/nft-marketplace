import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { WalletEntity } from '../../../users/entities/wallet.entity';

define(WalletEntity, (faker: typeof Faker) => {
  const wallet = new WalletEntity();
  wallet.balance = 10000;
  return wallet;
});
