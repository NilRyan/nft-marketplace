import { NotEnoughBalanceException } from './../../users/exceptions/not-enough-balance.exception';
import { AssetNotFoundException } from './../../assets/exceptions/asset-not-found.exception';
import { WalletsService } from './../../users/services/wallets.service';
import { TransactionRepository } from './../repositories/transaction.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AssetsService } from '../../assets/assets.service';
import { AssetEntity } from '../../assets/entities/asset.entity';
import { BuyOwnAssetForbiddenException } from '../../assets/exceptions/buy-asset-forbidden.exception';
import { UserEntity } from '../../users/entities/user.entity';

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
    this.validateTransaction(asset, assetId, buyer);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { id } = await queryRunner.manager.save(
        this.createBuyTransactionEntity(asset, buyer),
      );
      await queryRunner.manager.save(
        await Promise.all([
          this.walletsService.increaseBalance(asset.owner.wallet, asset.price),
          this.walletsService.decreaseBalance(buyer.wallet, asset.price),
          this.assetsService.transferOwnership(asset, buyer),
          this.assetsService.increaseAssetValue(asset),
        ]),
      );

      await queryRunner.commitTransaction();

      return this.transactionRepository.findOne(id, {
        relations: ['asset', 'buyer', 'seller', 'asset.owner'],
      });
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
  private validateTransaction(
    asset: AssetEntity,
    assetId: string,
    buyer: UserEntity,
  ) {
    if (!asset) throw new AssetNotFoundException(assetId);
    if (asset.ownerId === buyer.id) {
      throw new BuyOwnAssetForbiddenException(assetId);
    }
    if (+buyer.wallet.balance < +asset.price) {
      throw new NotEnoughBalanceException();
    }
  }
  private createBuyTransactionEntity(asset: AssetEntity, buyer: UserEntity) {
    const transaction = {
      asset,
      buyer,
      buyerId: buyer.id,
      seller: asset.owner,
      sellerId: asset.ownerId,
      assetId: asset.id,
      amount: asset.price,
    };
    return this.transactionRepository.create(transaction);
  }
}
