// import { WalletEntity } from '../../../users/entities/wallet.entity';
// import { Factory, Seeder } from 'typeorm-seeding';
// import { Connection } from 'typeorm';
// import { AssetEntity } from '../../../assets/entities/asset.entity';
// import { UserEntity } from '../../../users/entities/user.entity';
// import { CommentEntity } from '../../../comments/entities/comment.entity';

// export default class InitialDatabaseSeed implements Seeder {
//   public async run(factory: Factory, connection: Connection): Promise<void> {
//     await factory(UserEntity)()
//       .map(async (user: UserEntity) => {
//         const wallet: WalletEntity = await factory(WalletEntity)()
//           .map(async (wallet: WalletEntity) => {
//             wallet.owner = user;
//             wallet.ownerId = user.id;
//             return wallet;
//           })
//           .create();
//         const assets: AssetEntity[] = await factory(AssetEntity)()
//           .map(async (asset: AssetEntity) => {
//             asset.owner = user;
//             asset.ownerId = user.id;
//             asset.creator = user;
//             asset.creatorId = user.id;
//             const comments = await factory(CommentEntity)().createMany(10, {
//               author: user,
//               asset,
//               authorId: user.id,
//               assetId: asset.id,
//             });
//             asset.comments = comments;
//             return asset;
//           })
//           .createMany(10);
//         user.assets = assets;
//         user.wallet = wallet;
//         return user;
//       })
//       .createMany(5);
//   }
// }
