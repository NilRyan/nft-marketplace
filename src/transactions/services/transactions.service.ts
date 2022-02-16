import { AssetsService } from 'src/assets/assets.service';
import { WalletsService } from './../../users/services/wallets.service';
import { TransactionRepository } from './../repositories/transaction.repository';
import { UserEntity } from 'src/users/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { AssetEntity } from 'src/assets/entities/asset.entity';
import { WalletEntity } from 'src/users/entities/wallet.entity';

@Injectable()
export class TransactionsService {
  private logger = new Logger(TransactionsService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletsService: WalletsService,
    private readonly assetsService: AssetsService,
  ) {}

  async buyAsset(assetId: string, buyer: UserEntity) {
    const asset = await this.assetsService.getAssetAndOwner(assetId);
    if (!asset) throw new Error('Asset does not exist');
    if (asset.ownerId === buyer.id) {
      throw new Error('You cannot buy your own asset');
    }

    const buyerWallet = await this.walletsService.viewWalletByOwner(buyer);
    const sellerWallet = await this.walletsService.viewWalletByOwner(
      asset.owner,
    );

    const transaction = await this.createTransaction(
      asset,
      buyerWallet,
      sellerWallet,
    );
    await this.walletsService.increaseBalance(buyer, asset.price);
    await this.walletsService.decreaseBalance(asset.owner, asset.price);
    await this.assetsService.transferOwnership(assetId, buyer);
    await this.assetsService.increaseAssetValue(asset);

    return await this.transactionRepository.save(transaction);
  }

  async viewTransactions({ id }: UserEntity) {
    return await this.transactionRepository.find({
      where: [{ buyerId: id }, { sellerId: id }],
    });
  }

  private async createTransaction(
    asset: AssetEntity,
    buyerWallet: WalletEntity,
    sellerWallet: WalletEntity,
  ) {
    return this.transactionRepository.create({
      asset,
      buyerWallet,
      sellerWallet,
      buyer: buyerWallet.owner,
      buyerId: buyerWallet.owner.id,
      seller: asset.owner,
      sellerId: asset.ownerId,
      assetId: asset.id,
      amount: asset.price,
      buyerWalletId: buyerWallet.id,
      sellerWalletId: sellerWallet.id,
    });
  }
}
