import { UserEntity } from 'src/users/entities/user.entity';
import { WalletRepository } from './../repositories/wallets.repository';
import { Injectable, Logger } from '@nestjs/common';

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
}
