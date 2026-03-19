import { describe, expect, it, vi } from 'vitest'

vi.mock('@/server/config/githubConfig', () => ({
  GITHUB_OWNER: 'test-owner',
  GITHUB_REPO: 'test-repo',
  GITHUB_BRANCH: 'main',
}))

import { createBranch, safeDeleteBranch } from './branchManager'

function createMockOctokit(overrides: { repos?: Record<string, any>, git?: Record<string, any> } = {}) {
  const defaultRepos = {
    getBranch: vi.fn().mockRejectedValue({ status: 404 }),
  }
  const defaultGit = {
    getRef: vi.fn().mockResolvedValue({
      data: { object: { sha: 'abc123' } },
    }),
    createRef: vi.fn().mockResolvedValue({}),
    deleteRef: vi.fn().mockResolvedValue({}),
  }
  return {
    rest: {
      repos: { ...defaultRepos, ...overrides.repos },
      git: { ...defaultGit, ...overrides.git },
    },
  }
}

describe('branchManager', () => {
  describe('createBranch', () => {
    describe('when branch does not exist', () => {
      it('should create branch from main using getRef', async () => {
        const octokit = createMockOctokit()

        await createBranch(octokit, 'article/2026-03-19-mon-article')

        expect(octokit.rest.git.getRef).toHaveBeenCalledWith({
          owner: 'test-owner',
          repo: 'test-repo',
          ref: 'heads/main',
        })
        expect(octokit.rest.git.createRef).toHaveBeenCalledWith({
          owner: 'test-owner',
          repo: 'test-repo',
          ref: 'refs/heads/article/2026-03-19-mon-article',
          sha: 'abc123',
        })
      })
    })

    describe('when branch already exists (residual from previous attempt)', () => {
      it('should delete existing branch then create a new one from main', async () => {
        const octokit = createMockOctokit({
          repos: {
            getBranch: vi.fn().mockResolvedValue({ data: { name: 'article/2026-03-19-mon-article' } }),
          },
        })

        await createBranch(octokit, 'article/2026-03-19-mon-article')

        expect(octokit.rest.git.deleteRef).toHaveBeenCalledWith({
          owner: 'test-owner',
          repo: 'test-repo',
          ref: 'heads/article/2026-03-19-mon-article',
        })
        expect(octokit.rest.git.getRef).toHaveBeenCalledWith({
          owner: 'test-owner',
          repo: 'test-repo',
          ref: 'heads/main',
        })
        expect(octokit.rest.git.createRef).toHaveBeenCalledWith({
          owner: 'test-owner',
          repo: 'test-repo',
          ref: 'refs/heads/article/2026-03-19-mon-article',
          sha: 'abc123',
        })
      })
    })
  })

  describe('safeDeleteBranch', () => {
    describe('when deletion succeeds', () => {
      it('should return true', async () => {
        const octokit = createMockOctokit()

        const result = await safeDeleteBranch(octokit, 'article/test-branch')

        expect(result).toBe(true)
        expect(octokit.rest.git.deleteRef).toHaveBeenCalledWith({
          owner: 'test-owner',
          repo: 'test-repo',
          ref: 'heads/article/test-branch',
        })
      })
    })

    describe('when deletion fails', () => {
      it('should return false without throwing', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const octokit = createMockOctokit({
          git: {
            getRef: vi.fn().mockResolvedValue({ data: { object: { sha: 'abc123' } } }),
            createRef: vi.fn().mockResolvedValue({}),
            deleteRef: vi.fn().mockRejectedValue(new Error('Network error')),
          },
        })

        const result = await safeDeleteBranch(octokit, 'article/test-branch')

        expect(result).toBe(false)
        consoleErrorSpy.mockRestore()
      })

      it('should not propagate the exception', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const octokit = createMockOctokit({
          git: {
            getRef: vi.fn().mockResolvedValue({ data: { object: { sha: 'abc123' } } }),
            createRef: vi.fn().mockResolvedValue({}),
            deleteRef: vi.fn().mockRejectedValue(new Error('Permission denied')),
          },
        })

        await expect(safeDeleteBranch(octokit, 'article/test-branch')).resolves.toBe(false)
        vi.restoreAllMocks()
      })
    })
  })
})
