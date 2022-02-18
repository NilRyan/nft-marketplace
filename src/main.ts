import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   helmet({
  //     contentSecurityPolicy:
  //       process.env.NODE_ENV === 'production' ? undefined : false,
  //   }),
  // );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
/* TODO: Important
1. Enable atomicity with query runner, add missing entity fields for user
2. Unit tests
3. DataLoader
4. Caching
*/

/*
  Registration - need to complete details but mostly done
    - Users must be able to register an account using email/username and password and other info
      like (first name, last name, aboutMe, birth date, gender, etc.)
    - Passwords must be encrypted
  Login - DONE
    - Registered user must be able to login using bearer token -DONE
  User
    - User must be able to post an NFT with required image, title, description, category, price - DONE
    - User must be able to view other users profile - DONE
    - User must be able to view his/her wallet balance - DONE
    - Other user must not be able to view other users wallet balance - DONE
    - User must be able to update profile - DONE
    - User must be able to buy not deleted NFTs and <= currentBalance - DONE
    - User must not be able to softDelete other NFT post -DONE
    - User must be able to softDelete his/her NFT - DONE
    - If User is taken down, he/she must not be able to login the app / access any APIs that requires
      credentials except registration - Needs Verification
  Comment
    - User must be able to add comment on NFT - DONE
    - User must be able to update his/her comment - DONE
    - User must be able to delete his/her comment - DONE
    - Add paginations in comments - DONE
  Admin
    - Must be able to softDelete any NFT - DONE
    - Must be able to take down a user - DONE
    - Must be able to lift a taken down user - DONE
  Marketplace
    - Users must be able to perform an advanced search of NTFs. return any NFT that matches the
    keywords on (title, description, category, owner, creator, etc.)
    - User must be able to sort NFTs with advanced search results
    - Marketplace advanced search and filter must have pagination (total, limit, offset, page,
    totalPage, etc)
    - Advanced search and filter must not include deleted NFTs
  NFT Details
    - User must be able to view NFT details including comments

*/
