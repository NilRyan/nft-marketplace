import { Test } from '@nestjs/testing';
import { AssetsService } from '../../assets/assets.service';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { CommentsRepository } from '../repositories/comments.repository';
import { CommentsService } from './comments.service';

const mockCommentsRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  createComment: jest.fn(),
});

const mockAssetsService = () => ({
  getAssetById: jest.fn(),
});

const mockUserEntity = {
  id: '265adc7b-94b6-440f-ab45-014a26139e7d',
  username: 'testUser',
  firstName: 'Test',
  lastName: 'User',
  email: 'testUser@gmail.com',
} as UserEntity;
describe('Comments Service', () => {
  let commentsService: CommentsService;
  let assetsService;
  let commentsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: AssetsService,
          useFactory: mockAssetsService,
        },
        {
          provide: CommentsRepository,
          useFactory: mockCommentsRepository,
        },
      ],
    }).compile();

    commentsService = module.get(CommentsService);
    assetsService = module.get(AssetsService);
    commentsRepository = module.get(CommentsRepository);
  });

  describe('createComment', () => {
    it('returns the created Comment', async () => {
      assetsService.getAssetById.mockResolvedValue({
        id: '265adc7b-94b6-440f-ab45-014a26139e7d',
        name: 'testAsset',
        description: 'testAssetDescription',
        imageUrl: 'testAssetImageUrl',
      });
      const createCommentInput: CreateCommentInput = {
        comment: 'testComment',
        assetId: '265adc7b-94b6-440f-ab45-014a26139e7d',
      };
      const expectedComment = {
        ...createCommentInput,
        authorId: mockUserEntity.id,
      };
      commentsRepository.createComment.mockResolvedValue(expectedComment);

      const actualComment = await commentsService.createComment(
        createCommentInput,
        mockUserEntity,
      );
      expect(actualComment).toEqual(expectedComment);
    });

    it('throws a CommentNotFoundException if asset does not exist', async () => {
      assetsService.getAssetById.mockResolvedValue(null);
      expect(
        commentsService.createComment(
          {
            comment: 'testComment',
            assetId: '265adc7b-94b6-440f-ab45-014a26139e7d',
          },
          mockUserEntity,
        ),
      ).rejects.toThrow(CommentNotFoundException);
    });
  });

  describe('getCommentsByAssetId', () => {
    it('returns the comments for the asset', async () => {
      const expectedComment = {
        id: '265adc7b-94b6-440f-ab45-014a26139e7d',
        comment: 'testComment',
        authorId: mockUserEntity.id,
        assetId: '265adc7b-94b6-440f-ab45-014a26139e7d',
      };
      commentsRepository.findOne.mockResolvedValue(expectedComment);

      const actualComments = await commentsService.getCommentById(
        '265adc7b-94b6-440f-ab45-014a26139e7d',
      );
      expect(actualComments).toEqual(expectedComment);
    });
  });
});
