import { Buffer } from 'node:buffer'
import axios from 'axios'

import { describe, expect, it, mock, spyOn } from 'bun:test'
import { downloadAndConvertImage, extractImagesAndUpdateContent, extractMarkdownImageUrls } from '~/server/services/notion/imageUtils'

// Mock sharp module
mock.module('sharp', () => ({
  default: () => ({
    resize: () => ({
      webp: () => ({
        toBuffer: () => Promise.resolve(Buffer.from('webp image data')),
      }),
    }),
  }),
}))

// Mock axios.get
const originalGet = axios.get
const mockGet = mock(() => Promise.resolve({ data: Buffer.from('image data') }))
axios.get = mockGet as any

describe('image Utils', () => {
  it('should download and convert an image to webp format', async () => {
    const imageUrl = 'http://example.com/image.png'
    const imageName = 'test-image'

    // Mock axios to return a successful response
    mockGet.mockImplementationOnce(() => Promise.resolve({ data: Buffer.from('image data') }))

    const { webpImageName, imageContent } = await downloadAndConvertImage(imageUrl, imageName)
    expect(webpImageName).toBe('test-image.webp')
    expect(imageContent).toBe(Buffer.from('webp image data').toString('base64'))
  })

  it('should handle errors during image download and conversion', async () => {
    const imageUrl = 'http://example.com/image.png'
    const imageName = 'test-image'

    // Mock axios to throw an error
    mockGet.mockImplementationOnce(() => Promise.reject(new Error('Download error')))

    const spy = spyOn(console, 'error').mockImplementation(() => {})
    await expect(downloadAndConvertImage(imageUrl, imageName)).rejects.toThrow(`Error while processing image ${imageUrl}: Download error`)
    spy.mockRestore()
  })

  it('should extract images from markdown content', async () => {
    const content = '![Alt text](http://example.com/image1.png) Some text ![Another image](http://example.com/image2.png)'

    // Mock axios to return successful responses for image downloads
    mockGet
      .mockImplementationOnce(() => Promise.resolve({ data: Buffer.from('image data 1') }))
      .mockImplementationOnce(() => Promise.resolve({ data: Buffer.from('image data 2') }))

    const { updatedContent, imageFiles } = await extractImagesAndUpdateContent(content)

    expect(updatedContent).toContain('![Alt text](./assets/img1.webp)')
    expect(updatedContent).toContain('![Another image](./assets/img2.webp)')
    expect(imageFiles).toHaveLength(2)
    expect(imageFiles[0]?.name).toBe('img1.webp')
    expect(imageFiles[1]?.name).toBe('img2.webp')
    expect(imageFiles[0]?.content).toBe(Buffer.from('webp image data').toString('base64'))
    expect(imageFiles[1]?.content).toBe(Buffer.from('webp image data').toString('base64'))
  })

  describe('extractMarkdownImageUrls', () => {
    it('extracts the URL correctly when the alt text contains parentheses', () => {
      const content = '![alt with (parens) and (more) parens](https://example.com/img.png?a=1&b=2)'
      const urls = extractMarkdownImageUrls(content)
      expect(urls).toEqual(['https://example.com/img.png?a=1&b=2'])
    })

    it('extracts multiple image URLs from content', () => {
      const content = '![one](https://a.com/1.png) and ![two (with parens)](https://b.com/2.png?x=y)'
      const urls = extractMarkdownImageUrls(content)
      expect(urls).toEqual(['https://a.com/1.png', 'https://b.com/2.png?x=y'])
    })

    it('extracts real Notion S3 signed URL even when alt text contains parens', () => {
      const alt = 'Schéma (avec paren) et (autre paren), fin.'
      const url = 'https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/def/Schema.png?X-Amz-Signature=xyz&X-Amz-SignedHeaders=host'
      const content = `![${alt}](${url})`
      const urls = extractMarkdownImageUrls(content)
      expect(urls).toEqual([url])
    })
  })

  it('throws if a Notion S3 URL remains after extraction attempt failed silently', async () => {
    const notionUrl = 'https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/def/Schema.png?X-Amz-Signature=expired'
    const content = `![alt (with parens)](${notionUrl})`

    // Simulate all downloads failing (e.g. expired signed URL)
    mockGet.mockImplementation(() => Promise.reject(new Error('Request failed with status code 403')))

    const spy = spyOn(console, 'error').mockImplementation(() => {})
    await expect(extractImagesAndUpdateContent(content)).rejects.toThrow(/Failed to download inline image from Notion/)
    spy.mockRestore()
  })
})
