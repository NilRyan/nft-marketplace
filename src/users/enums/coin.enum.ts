import { registerEnumType } from '@nestjs/graphql';

enum Coin {
  CalapeCoin = 'CalapeCoin',
  ArgCoin = 'ArgCoin',
  PhilipCoin = 'PhilipCoin',
}

export default Coin;

registerEnumType(Coin, { name: 'Coin', description: 'Coin type' });
