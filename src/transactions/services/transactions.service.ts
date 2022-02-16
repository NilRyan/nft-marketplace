import { AssetsService } from 'src/assets/assets.service';
import { WalletsService } from './../../users/services/wallets.service';
import { TransactionRepository } from './../repositories/transaction.repository';
import { UserEntity } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { AssetEntity } from 'src/assets/entities/asset.entity';

@Injectable()
export class TransactionsService {
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
    const transaction = this.createTransaction(asset, buyer);

    await this.walletsService.increaseBalance(buyer, asset.price);
    await this.walletsService.decreaseBalance(asset.owner, asset.price);
    await this.assetsService.transferOwnership(assetId, buyer);
    return await this.transactionRepository.save(transaction);
  }

  private createTransaction(asset: AssetEntity, buyer: UserEntity) {
    return this.transactionRepository.create({
      asset,
      buyer,
      buyerId: buyer.id,
      seller: asset.owner,
      sellerId: asset.ownerId,
      assetId: asset.id,
      amount: asset.price,
      buyerWalletId: buyer.wallet.id,
      sellerWalletId: asset.owner.wallet.id,
      buyerWallet: buyer.wallet,
      sellerWallet: asset.owner.wallet,
    });
  }

  async viewTransactions({ id }: UserEntity) {
    return await this.transactionRepository.find({
      where: [{ buyerId: id }, { sellerId: id }],
    });
  }
}
