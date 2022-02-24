import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { AssetEntity } from '../../../assets/entities/asset.entity';

define(AssetEntity, (faker: typeof Faker) => {
  const asset = new AssetEntity();
  asset.category = faker.random.word();
  asset.imageUrl = faker.image.imageUrl();
  asset.description = faker.lorem.sentence();
  asset.price = faker.random.number();
  asset.title = faker.lorem.sentence();
  return asset;
});
