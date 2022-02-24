import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';

import { WalletOutput } from '../dto/wallet.output';
import { UserEntity } from '../entities/user.entity';
import { WalletsService } from '../services/wallets.service';

@UseGuards(GqlAuthGuard)
@Resolver((of) => WalletOutput)
export class WalletsResolver {
  constructor(private readonly walletsService: WalletsService) {}

  @Query((returns) => WalletOutput)
  async viewWallet(@GetCurrentUser() user: UserEntity) {
    return await this.walletsService.getWalletByOwner(user);
  }
}
