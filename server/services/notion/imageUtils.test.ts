import { Buffer } from 'node:buffer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { downloadAndConvertImage, extractImagesAndUpdateContent } from '~/server/services/notion/imageUtils'
import * as sharp from 'sharp'

// Mock axios manually
axios.get = vi.fn()

// Mock sharp manually
vi.spyOn(sharp, 'default').mockImplementation(() => ({
  webp: vi.fn().mockReturnThis(),
  toBuffer: vi.fn().mockResolvedValue(Buffer.from('webp image data')),
}) as any)

describe('Image Utils', () => {
  it('should download and convert an image to webp format', async () => {
    const imageUrl = 'http://example.com/image.png'
    const imageName = 'test-image'

    // Mock axios to return a successful response
    axios.get.mockResolvedValueOnce({ data: Buffer.from('image data') })

    const { webpImageName, imageContent } = await downloadAndConvertImage(imageUrl, imageName)
    expect(webpImageName).toBe('test-image.webp')
    expect(imageContent).toBe(Buffer.from('webp image data').toString('base64')) // base64 of 'webp image data'
  })

  it('should handle errors during image download and conversion', async () => {
    const imageUrl = 'http://example.com/image.png'
    const imageName = 'test-image'

    // Mock axios to throw an error
    axios.get.mockRejectedValueOnce(new Error('Download error'))

    await expect(downloadAndConvertImage(imageUrl, imageName)).rejects.toThrow(`Error while processing image ${imageUrl}: Download error`)
  })

  it('should extract images from markdown content', async () => {
    const content = '![Alt text](http://example.com/image1.png) Some text ![Another image](http://example.com/image2.png)'

    // Mock axios to return a successful response for the image download
    axios.get.mockResolvedValueOnce({ data: Buffer.from('image data 1') })
      .mockResolvedValueOnce({ data: Buffer.from('image data 2') })

    const { updatedContent, imageFiles, lastValidImageUrl } = await extractImagesAndUpdateContent(content)

    expect(updatedContent).toContain('![Alt text](./assets/img1.webp)')
    expect(updatedContent).toContain('![Another image](./assets/img2.webp)')
    expect(imageFiles).toHaveLength(2)
    expect(imageFiles[0].name).toBe('img1.webp')
    expect(imageFiles[1].name).toBe('img2.webp')
    expect(imageFiles[0].content).toBe(Buffer.from('webp image data').toString('base64'))
    expect(imageFiles[1].content).toBe(Buffer.from('webp image data').toString('base64'))
  })
})
