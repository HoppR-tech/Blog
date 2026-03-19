import { describe, expect, it, vi } from 'vitest'

vi.mock('@/server/config/githubConfig', () => ({
  GITHUB_OWNER: 'test-owner',
  GITHUB_REPO: 'test-repo',
  GITHUB_BRANCH: 'main',
}))

import { closePullRequestsForBranch } from './pullRequestManager'

function createMockOctokit(overrides: Record<string, any> = {}) {
  return {
    rest: {
      pulls: {
        list: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockResolvedValue({}),
        ...overrides.pulls,
      },
    },
  }
}

describe('pullRequestManager', () => {
  describe('closePullRequestsForBranch', () => {
    describe('when an open PR exists for the branch', () => {
      it('should close the PR', async () => {
        const octokit = createMockOctokit({
          pulls: {
            list: vi.fn().mockResolvedValue({
              data: [{ number: 42 }],
            }),
            update: vi.fn().mockResolvedValue({}),
          },
        })

        await closePullRequestsForBranch(octokit, 'article/2026-03-19-mon-article')

        expect(octokit.rest.pulls.list).toHaveBeenCalledWith({
          owner: 'test-owner',
          repo: 'test-repo',
          head: 'test-owner:article/2026-03-19-mon-article',
          state: 'open',
        })
        expect(octokit.rest.pulls.update).toHaveBeenCalledWith({
          owner: 'test-owner',
          repo: 'test-repo',
          pull_number: 42,
          state: 'closed',
        })
      })
    })

    describe('when no open PR exists for the branch', () => {
      it('should be a no-op without error', async () => {
        const octokit = createMockOctokit()

        await closePullRequestsForBranch(octokit, 'article/no-pr')

        expect(octokit.rest.pulls.list).toHaveBeenCalled()
        expect(octokit.rest.pulls.update).not.toHaveBeenCalled()
      })
    })

    describe('when closing a PR fails', () => {
      it('should not propagate the exception', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const octokit = createMockOctokit({
          pulls: {
            list: vi.fn().mockResolvedValue({
              data: [{ number: 99 }],
            }),
            update: vi.fn().mockRejectedValue(new Error('API error')),
          },
        })

        await closePullRequestsForBranch(octokit, 'article/failing-pr')

        expect(consoleErrorSpy).toHaveBeenCalled()
        consoleErrorSpy.mockRestore()
      })
    })
  })
})
