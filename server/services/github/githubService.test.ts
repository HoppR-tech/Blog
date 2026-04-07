import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/server/config/githubConfig', () => ({
  GITHUB_OWNER: 'test-owner',
  GITHUB_REPO: 'test-repo',
  GITHUB_BRANCH: 'main',
}))

vi.mock('./branchManager', () => ({
  createBranch: vi.fn().mockResolvedValue(undefined),
  deleteBranch: vi.fn().mockResolvedValue(undefined),
  safeDeleteBranch: vi.fn().mockResolvedValue(true),
}))

vi.mock('./pullRequestManager', () => ({
  createPullRequest: vi.fn().mockResolvedValue({ number: 1 }),
  mergePullRequest: vi.fn().mockResolvedValue(undefined),
  closePullRequestsForBranch: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('./imageUploader', () => ({
  uploadCoverImage: vi.fn().mockResolvedValue({}),
  uploadAllImages: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('./contentUploader', () => ({
  uploadToGitHub: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('./postChecker', () => ({
  checkPost: vi.fn(),
}))

vi.mock('@/utils/stringUtils', () => ({
  createFolderName: vi.fn().mockReturnValue('2026-03-19-mon-article'),
}))

const { GitHubService } = await import('./githubService')
const { createBranch, deleteBranch, safeDeleteBranch } = await import('./branchManager')
const { createPullRequest, mergePullRequest, closePullRequestsForBranch } = await import('./pullRequestManager')
const { uploadCoverImage } = await import('./imageUploader')
const { checkPost } = await import('./postChecker')

function createMockNotionService() {
  return {
    extractImagesAndUpdateContent: vi.fn().mockResolvedValue({ updatedContent: 'content', imageFiles: [] }),
    processAuthorsImages: vi.fn().mockResolvedValue({ updatedAuthors: [], authorImages: [] }),
    generateMarkdownContent: vi.fn().mockReturnValue('# Markdown'),
    updatePostStatusInNotion: vi.fn().mockResolvedValue(undefined),
    updatePublishedDateInNotion: vi.fn().mockResolvedValue(undefined),
  }
}

function createMockPost() {
  return {
    notionId: 'notion-123',
    title: 'Mon Article',
    date: '2026-03-19',
    description: 'A test article',
    image: 'http://example.com/cover.jpg',
    alt: 'Cover',
    ogImage: 'http://example.com/og.jpg',
    tags: ['craft'],
    published: false,
    authors: [],
    reviewers: [],
    content: 'Some content',
  }
}

describe('gitHubService', () => {
  const mockOctokit = {} as any

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('publishPostToGitHub', () => {
    describe('when image upload fails after branch creation', () => {
      it('should cleanup the branch and rethrow the original error', async () => {
        const notionService = createMockNotionService()
        const service = new GitHubService(mockOctokit, notionService as any)
        const post = createMockPost()

        ;(uploadCoverImage as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Invalid image format'))

        await expect(service.publishPostToGitHub(post)).rejects.toThrow('Invalid image format')

        expect(createBranch).toHaveBeenCalled()
        expect(safeDeleteBranch).toHaveBeenCalled()
        expect(closePullRequestsForBranch).toHaveBeenCalled()
      })
    })

    describe('when post validation fails after branch creation', () => {
      it('should cleanup the branch and rethrow the validation error', async () => {
        const notionService = createMockNotionService()
        const service = new GitHubService(mockOctokit, notionService as any)
        const post = createMockPost()

        ;(checkPost as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
          throw new Error('Tag is missing')
        })

        await expect(service.publishPostToGitHub(post)).rejects.toThrow('Tag is missing')

        expect(createBranch).toHaveBeenCalled()
        expect(safeDeleteBranch).toHaveBeenCalled()
        expect(closePullRequestsForBranch).toHaveBeenCalled()
      })
    })

    describe('when cleanup itself fails after a pipeline error', () => {
      it('should rethrow the original error, not the cleanup error', async () => {
        const notionService = createMockNotionService()
        const service = new GitHubService(mockOctokit, notionService as any)
        const post = createMockPost()

        ;(uploadCoverImage as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Original pipeline error'))
        ;(safeDeleteBranch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false)

        await expect(service.publishPostToGitHub(post)).rejects.toThrow('Original pipeline error')
      })
    })

    describe('when publication succeeds and branch is merged', () => {
      it('should delete branch once after merge and not trigger cleanup in finally', async () => {
        const notionService = createMockNotionService()
        const service = new GitHubService(mockOctokit, notionService as any)
        const post = createMockPost()

        await service.publishPostToGitHub(post)

        expect(createBranch).toHaveBeenCalledTimes(1)
        expect(mergePullRequest).toHaveBeenCalledTimes(1)
        expect(deleteBranch).toHaveBeenCalledTimes(1)
        expect(safeDeleteBranch).not.toHaveBeenCalled()
        expect(closePullRequestsForBranch).not.toHaveBeenCalled()
      })
    })
  })
})
