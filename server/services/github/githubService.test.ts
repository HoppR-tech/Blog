import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

mock.module('@/server/config/githubConfig', () => ({
  GITHUB_OWNER: 'test-owner',
  GITHUB_REPO: 'test-repo',
  GITHUB_BRANCH: 'main',
  GITHUB_APP_ID: 12345,
  GITHUB_PRIVATE_KEY: 'fake-key',
}))

const mockCreateBranch = mock(() => Promise.resolve(undefined))
const mockDeleteBranch = mock(() => Promise.resolve(undefined))
const mockSafeDeleteBranch = mock(() => Promise.resolve(true))

mock.module('./branchManager', () => ({
  createBranch: mockCreateBranch,
  deleteBranch: mockDeleteBranch,
  safeDeleteBranch: mockSafeDeleteBranch,
}))

const mockCreatePullRequest = mock(() => Promise.resolve({ number: 1 }))
const mockMergePullRequest = mock(() => Promise.resolve(undefined))
const mockClosePullRequestsForBranch = mock(() => Promise.resolve(undefined))

mock.module('./pullRequestManager', () => ({
  createPullRequest: mockCreatePullRequest,
  mergePullRequest: mockMergePullRequest,
  closePullRequestsForBranch: mockClosePullRequestsForBranch,
}))

const mockUploadCoverImage = mock(() => Promise.resolve({}))
const mockUploadAllImages = mock(() => Promise.resolve(undefined))

mock.module('./imageUploader', () => ({
  uploadCoverImage: mockUploadCoverImage,
  uploadAllImages: mockUploadAllImages,
}))

const mockUploadToGitHub = mock(() => Promise.resolve(undefined))

mock.module('./contentUploader', () => ({
  uploadToGitHub: mockUploadToGitHub,
}))

const mockCheckPost = mock(() => {})

mock.module('./postChecker', () => ({
  checkPost: mockCheckPost,
}))

mock.module('@/utils/stringUtils', () => ({
  createFolderName: () => '2026-03-19-mon-article',
}))

const { GitHubService } = await import('./githubService')

function createMockNotionService() {
  return {
    extractImagesAndUpdateContent: mock(() => Promise.resolve({ updatedContent: 'content', imageFiles: [] })),
    processAuthorsImages: mock(() => Promise.resolve({ updatedAuthors: [], authorImages: [] })),
    generateMarkdownContent: mock(() => '# Markdown'),
    updatePostStatusInNotion: mock(() => Promise.resolve(undefined)),
    updatePublishedDateInNotion: mock(() => Promise.resolve(undefined)),
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
    mockCreateBranch.mockReset()
    mockDeleteBranch.mockReset()
    mockSafeDeleteBranch.mockReset()
    mockCreatePullRequest.mockReset()
    mockMergePullRequest.mockReset()
    mockClosePullRequestsForBranch.mockReset()
    mockUploadCoverImage.mockReset()
    mockUploadAllImages.mockReset()
    mockUploadToGitHub.mockReset()
    mockCheckPost.mockReset()

    // Restore defaults after reset
    mockCreateBranch.mockImplementation(() => Promise.resolve(undefined))
    mockDeleteBranch.mockImplementation(() => Promise.resolve(undefined))
    mockSafeDeleteBranch.mockImplementation(() => Promise.resolve(true))
    mockCreatePullRequest.mockImplementation(() => Promise.resolve({ number: 1 }))
    mockMergePullRequest.mockImplementation(() => Promise.resolve(undefined))
    mockClosePullRequestsForBranch.mockImplementation(() => Promise.resolve(undefined))
    mockUploadCoverImage.mockImplementation(() => Promise.resolve({}))
    mockUploadAllImages.mockImplementation(() => Promise.resolve(undefined))
    mockUploadToGitHub.mockImplementation(() => Promise.resolve(undefined))
    mockCheckPost.mockImplementation(() => {})

    spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('publishPostToGitHub', () => {
    describe('when image upload fails after branch creation', () => {
      it('should cleanup the branch and rethrow the original error', async () => {
        const notionService = createMockNotionService()
        const service = new GitHubService(mockOctokit, notionService as any)
        const post = createMockPost()

        mockUploadCoverImage.mockImplementationOnce(() => Promise.reject(new Error('Invalid image format')))

        await expect(service.publishPostToGitHub(post)).rejects.toThrow('Invalid image format')

        expect(mockCreateBranch).toHaveBeenCalled()
        expect(mockSafeDeleteBranch).toHaveBeenCalled()
        expect(mockClosePullRequestsForBranch).toHaveBeenCalled()
      })
    })

    describe('when post validation fails after branch creation', () => {
      it('should cleanup the branch and rethrow the validation error', async () => {
        const notionService = createMockNotionService()
        const service = new GitHubService(mockOctokit, notionService as any)
        const post = createMockPost()

        mockCheckPost.mockImplementationOnce(() => {
          throw new Error('Tag is missing')
        })

        await expect(service.publishPostToGitHub(post)).rejects.toThrow('Tag is missing')

        expect(mockCreateBranch).toHaveBeenCalled()
        expect(mockSafeDeleteBranch).toHaveBeenCalled()
        expect(mockClosePullRequestsForBranch).toHaveBeenCalled()
      })
    })

    describe('when cleanup itself fails after a pipeline error', () => {
      it('should rethrow the original error, not the cleanup error', async () => {
        const notionService = createMockNotionService()
        const service = new GitHubService(mockOctokit, notionService as any)
        const post = createMockPost()

        mockUploadCoverImage.mockImplementationOnce(() => Promise.reject(new Error('Original pipeline error')))
        mockSafeDeleteBranch.mockImplementationOnce(() => Promise.resolve(false))

        await expect(service.publishPostToGitHub(post)).rejects.toThrow('Original pipeline error')
      })
    })

    describe('when publication succeeds and branch is merged', () => {
      it('should delete branch once after merge and not trigger cleanup in finally', async () => {
        const notionService = createMockNotionService()
        const service = new GitHubService(mockOctokit, notionService as any)
        const post = createMockPost()

        await service.publishPostToGitHub(post)

        expect(mockCreateBranch).toHaveBeenCalledTimes(1)
        expect(mockMergePullRequest).toHaveBeenCalledTimes(1)
        expect(mockDeleteBranch).toHaveBeenCalledTimes(1)
        expect(mockSafeDeleteBranch).not.toHaveBeenCalled()
        expect(mockClosePullRequestsForBranch).not.toHaveBeenCalled()
      })
    })
  })
})
