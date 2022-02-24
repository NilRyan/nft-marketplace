import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AssetsService } from '../../assets/services/assets.service';
import { AssetNotFoundException } from '../../assets/exceptions/asset-not-found.exception';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { CommentsRepository } from '../repositories/comments.repository';
import { CommentsService } from './comments.service';

const mockCommentsRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  delete: jest.fn(),
  getPaginatedCommentsForAsset: jest.fn(),
});

const mockAssetsService = () => ({
  getAssetAndOwner: jest.fn(),
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
      assetsService.getAssetAndOwner.mockResolvedValue({
        id: '25',
        name: 'testAsset',
        description: 'testAssetDescription',
        imageUrl: 'testAssetImageUrl',
      });
      const createCommentInput: CreateCommentInput = {
        comment: 'testComment',
        assetId: '25',
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

    it('throws a AssetNotFoundException if asset does not exist', async () => {
      assetsService.getAssetAndOwner.mockResolvedValue(null);
      expect(
        commentsService.createComment(
          {
            comment: 'testComment',
            assetId: 'nonExistingAssetId',
          },
          mockUserEntity,
        ),
      ).rejects.toThrow(AssetNotFoundException);
    });
  });

  describe('getCommentById', () => {
    it('returns the comment', async () => {
      const expectedComment = {
        id: '1',
        comment: 'testComment',
        authorId: mockUserEntity.id,
        assetId: '265adc7b-94b6-440f-ab45-014a26139e7d',
      };
      commentsRepository.findOne.mockResolvedValue(expectedComment);

      const actualComments = await commentsService.getCommentById('1');
      expect(actualComments).toEqual(expectedComment);
    });
  });

  describe('updateComment', () => {
    it('throws a CommentNotFoundException if comment does not exist', async () => {
      commentsRepository.findOne.mockResolvedValue(null);
      expect(
        commentsService.updateComment(
          {
            id: 'non-existent-id',
            comment: 'testComment',
          },
          mockUserEntity,
        ),
      ).rejects.toThrow(CommentNotFoundException);
    });

    it('throws an UnauthorizedException if user is not the author', async () => {
      commentsRepository.findOne.mockResolvedValue({
        id: '265adc7b-94b6-440f-ab45-014a26139e7d',
        comment: 'testComment',
        authorId: 'another-authorId',
      });
      expect(
        commentsService.updateComment(
          {
            id: '265adc7b-94b6-440f-ab45-014a26139e7d',
            comment: 'updateTestComment',
          },
          mockUserEntity,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('updates and returns the updated comment', async () => {
      commentsRepository.findOne.mockResolvedValue({
        id: '1',
        comment: 'testComment',
        authorId: mockUserEntity.id,
      });
      commentsRepository.updateComment.mockResolvedValue({
        id: '1',
        comment: 'updateTestComment',
        authorId: mockUserEntity.id,
      });

      const actualComment = await commentsService.updateComment(
        {
          id: '1',
          comment: 'updateTestComment',
        },
        mockUserEntity,
      );
      expect(actualComment).toEqual({
        id: '1',
        comment: 'updateTestComment',
        authorId: mockUserEntity.id,
      });
    });
  });

  describe('deleteComment', () => {
    it('throws a CommentNotFoundException if comment does not exist', async () => {
      commentsRepository.findOne.mockResolvedValue(null);
      expect(
        commentsService.deleteComment('non-existent-id', mockUserEntity),
      ).rejects.toThrow(CommentNotFoundException);
    });

    it('throws an UnauthorizedException if user is not the author', async () => {
      commentsRepository.findOne.mockResolvedValue({
        id: '1',
        comment: 'testComment',
        authorId: 'another-authorId',
      });
      expect(
        commentsService.deleteComment('1', mockUserEntity),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deletes and returns the deleted comment', async () => {
      commentsRepository.findOne.mockResolvedValue({
        id: '1',
        comment: 'testComment',
        authorId: mockUserEntity.id,
      });
      commentsRepository.delete.mockResolvedValue({
        id: '1',
        comment: 'testComment',
        authorId: mockUserEntity.id,
      });

      const actualComment = await commentsService.deleteComment(
        '1',
        mockUserEntity,
      );
      expect(actualComment).toEqual({
        id: '1',
        comment: 'testComment',
        authorId: mockUserEntity.id,
      });
    });
  });
  describe('getPaginatedCommentsForAsset', () => {
    it('calls the comments repository and returns its result', async () => {
      commentsRepository.getPaginatedCommentsForAsset.mockResolvedValue(
        'paginatedComments',
      );
      const actualComments = await commentsService.getPaginatedCommentsForAsset(
        '1',
        {
          limit: 50,
          offset: 10,
          orderBy: {
            field: 'createdAt',
            sortOrder: 'DESC',
          },
        },
      );
      expect(actualComments).toEqual('paginatedComments');
    });
  });
});
