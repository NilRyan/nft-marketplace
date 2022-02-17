import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/auth/get-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { WalletOutput } from '../dto/wallet.output';
import { UserEntity } from '../entities/user.entity';
import { WalletsService } from '../services/wallets.service';

@UseGuards(GqlAuthGuard)
@Resolver((of) => WalletOutput)
export class WalletsResolver {
  constructor(private readonly walletsService: WalletsService) {}

  @Query((returns) => WalletOutput)
  async viewWallet(@GetUser() user: UserEntity) {
    return await this.walletsService.getWalletByOwner(user);
  }
}
