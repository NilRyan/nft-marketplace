import { UserEntity } from 'src/users/entities/user.entity';
import { WalletRepository } from './../repositories/wallets.repository';
import { Injectable, Logger } from '@nestjs/common';
import { WalletEntity } from '../entities/wallet.entity';
import * as currency from 'currency.js';

@Injectable()
export class WalletsService {
  private logger = new Logger(WalletsService.name);
  constructor(private readonly walletRepository: WalletRepository) {}

  async createWallet(user: UserEntity) {
    return await this.walletRepository.createWallet(user);
  }

  async viewWalletByOwner(owner: UserEntity) {
    return await this.walletRepository.findOne({
      where: { owner },
      relations: ['owner'],
    });
  }
  // TODO: implement balance logic with currency js
  async increaseBalance(wallet: WalletEntity, amount: number) {
    const increasedBalance = currency(wallet.balance, { precision: 8 }).add(
      amount,
    ).value;
    await this.walletRepository.update(wallet.id, {
      balance: increasedBalance,
    });
  }

  async decreaseBalance(wallet: WalletEntity, amount: number) {
    const decreasedBalance = currency(wallet.balance, {
      precision: 8,
    }).subtract(amount).value;
    await this.walletRepository.update(wallet.id, {
      balance: decreasedBalance,
    });
  }
}
