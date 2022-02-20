import { NotEnoughBalanceException } from './../../users/exceptions/not-enough-balance.exception';
import { AssetNotFoundException } from './../../assets/exceptions/asset-not-found.exception';
import { AssetsService } from 'src/assets/assets.service';
import { WalletsService } from './../../users/services/wallets.service';
import { TransactionRepository } from './../repositories/transaction.repository';
import { UserEntity } from 'src/users/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { AssetEntity } from 'src/assets/entities/asset.entity';
import { WalletEntity } from 'src/users/entities/wallet.entity';
import { BuyOwnAssetForbiddenException } from 'src/assets/exceptions/buy-asset-forbidden.exception';
import { Connection } from 'typeorm';

@Injectable()
export class TransactionsService {
  private logger = new Logger(TransactionsService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletsService: WalletsService,
    private readonly assetsService: AssetsService,
    private connection: Connection,
  ) {}

  async buyAsset(assetId: string, buyer: UserEntity) {
    const asset = await this.assetsService.getAssetAndOwner(assetId);
    if (!asset) throw new AssetNotFoundException(assetId);
    if (asset.ownerId === buyer.id)
      throw new BuyOwnAssetForbiddenException(assetId);

    const buyerWallet = buyer.wallet;
    if (+buyerWallet.balance < +asset.price) {
      throw new NotEnoughBalanceException();
    }
    const sellerWallet = asset.owner.wallet;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transaction = this.createTransaction(asset, buyerWallet);

      const increasedSellerWallet = await this.walletsService.increaseBalance(
        sellerWallet,
        asset.price,
      );
      await queryRunner.manager.save(increasedSellerWallet);

      const decreasedBuyerWallet = await this.walletsService.decreaseBalance(
        buyerWallet,
        asset.price,
      );
      await queryRunner.manager.save(decreasedBuyerWallet);
      await queryRunner.manager.save(assetId, {
        owner: buyer,
        ownerId: buyer.id,
        lastSale: new Date(),
      });
      const assetWithValueIncrease =
        await this.assetsService.increaseAssetValue(asset);
      await queryRunner.manager.save(assetWithValueIncrease);
      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      queryRunner.release();
    }
  }

  async viewTransactions(user: UserEntity) {
    return await this.transactionRepository.find({
      where: [
        {
          buyer: user,
        },
        { seller: user },
      ],
      relations: ['asset', 'buyer', 'seller', 'asset.owner'],
    });
  }

  private createTransaction(asset: AssetEntity, buyerWallet: WalletEntity) {
    const transaction = {
      asset,
      buyer: buyerWallet.owner,
      buyerId: buyerWallet.owner.id,
      seller: asset.owner,
      sellerId: asset.ownerId,
      assetId: asset.id,
      amount: asset.price,
    };
    this.transactionRepository.create(transaction);
    return transaction;
  }
}
