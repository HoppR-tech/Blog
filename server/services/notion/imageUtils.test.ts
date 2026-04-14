import { Buffer } from 'node:buffer'
import axios from 'axios'

import { describe, expect, it, mock, spyOn } from 'bun:test'
import { downloadAndConvertImage, extractImagesAndUpdateContent } from '~/server/services/notion/imageUtils'

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
})
