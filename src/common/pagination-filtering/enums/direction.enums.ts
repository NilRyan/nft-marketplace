import { registerEnumType } from '@nestjs/graphql';

enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export default Direction;
registerEnumType(Direction, {
  name: 'Direction',
  description: 'Direction for sorting',
});
