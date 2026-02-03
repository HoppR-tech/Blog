import { describe, expect, it } from 'vitest'
import type { BlogPost } from '@/types/blog'
import { checkBlocks, checkPost } from './postChecker'
import type { BlockObjectResponse, Heading1BlockObjectResponse, Heading2BlockObjectResponse, Heading3BlockObjectResponse, ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

describe('postChecker', () => {
    describe('Check cover image', () => {
        it('should throw Error for missing cover image', () => {
            const post = buildDefaultPost();
            post.image = '';
            expect(() => checkPost(post)).toThrowError('Cover image is missing');
        });
        
        it('should not throw Error if correct cover image', () => {
            const post = buildDefaultPost();
            post.image = 'http://example.com/image.jpg';
            expect(() => checkPost(post)).not.toThrowError();
        });
    });

      
    describe('Check date', () => {
        it('should throw Error for missing date', () => {
            const post = buildDefaultPost();
            post.date = '';
            expect(() => checkPost(post)).toThrowError('Date is missing');
        });

        it('should throw Error for invalid date', () => {
            const post = buildDefaultPost();
            post.date = 'This is not a date';
            expect(() => checkPost(post)).toThrowError('Invalid date provided');
        });
        
        it('should not throw Error if correct date', () => {
            const post = buildDefaultPost();
            post.date = new Date('2024-08-02T15:59:20.808Z').toISOString();
            expect(() => checkPost(post)).not.toThrowError();
        });
    });

    
    describe('Check content', () => {
        it('should throw Error for missing content', () => {
            const post = buildDefaultPost();
            post.content = '';
            expect(() => checkPost(post)).toThrowError('Content is missing');
        });
        
        it('should not throw Error if correct content', () => {
            const post = buildDefaultPost();
            post.content = 'This is an article';
            expect(() => checkPost(post)).not.toThrowError();
        });
    });

    describe('Check blocks', () => {
        
        const paragraphBlock = buildDefaultParagraphBlock();
        const heading1Block = buildDefaultHeading1Block();
        const heading2Block = buildDefaultHeading2Block();

        it('should not throw Error without heading 1', () => {
            expect(() => checkBlocks([paragraphBlock])).not.toThrowError();
        });
        
        it('should not throw Error for heading 1 at start', () => {
            expect(() => checkBlocks([heading1Block, paragraphBlock])).not.toThrowError();
        });
        
        it('should throw Error for two heading 1', () => {
            expect(() => checkBlocks([heading1Block, heading1Block])).toThrowError('Heading 1 is only permitted at the start of the article content');
        });
        
        it('should throw Error paragraph then heading 1', () => {
            expect(() => checkBlocks([paragraphBlock, heading1Block])).toThrowError('Heading 1 is only permitted at the start of the article content');
        });
        
        it('should throw Error is starts with other than heading 1 or paragraph block', () => {
            expect(() => checkBlocks([heading2Block, paragraphBlock])).toThrowError('An article must start with a title or an introduction');
        });
    });

    describe('Check heading hierarchy', () => {

        const paragraphBlock = buildDefaultParagraphBlock();
        const heading2Block = buildDefaultHeading2Block();
        const heading3Block = buildDefaultHeading3Block();

        it('should throw Error when article has heading_3 but no heading_2', () => {
            expect(() => checkBlocks([paragraphBlock, heading3Block])).toThrowError(
                'Article contains heading 3 without any heading 2. Use heading 2 for main sections to enable Table of Contents.'
            );
        });

        it('should not throw Error when article has heading_2 and heading_3', () => {
            expect(() => checkBlocks([paragraphBlock, heading2Block, heading3Block])).not.toThrowError();
        });

        it('should not throw Error when article has no headings', () => {
            expect(() => checkBlocks([paragraphBlock])).not.toThrowError();
        });

        it('should not throw Error when article has only heading_2', () => {
            expect(() => checkBlocks([paragraphBlock, heading2Block])).not.toThrowError();
        });
    });
  })

function buildDefaultPost(): BlogPost {
    return {
        notionId: '1',
        title: 'Test Title',
        date: new Date('2024-08-02T15:59:20.808Z').toISOString(),
        description: 'This is a test description.',
        image: 'http://example.com/image.jpg',
        alt: 'Test Image',
        ogImage: 'http://example.com/og-image.jpg',
        tags: ['test', 'markdown'],
        published: false,
        authors: [],
        reviewers: [],
        content: '<!-- markdownlint-disable-file -->\n\nThis is content',
    }
}

function buildDefaultParagraphBlock(): ParagraphBlockObjectResponse {
    return {
        ...buildDefaultBlock(),
        type: 'paragraph',
        paragraph: {
            rich_text: [],
            color: 'default'
        }
    } as ParagraphBlockObjectResponse
}


function buildDefaultHeading1Block(): Heading1BlockObjectResponse {
    return {
        ...buildDefaultBlock(),
        type: 'heading_1',
        heading_1: {
            rich_text: [],
            color: 'default',
            is_toggleable: true
        }
    } as Heading1BlockObjectResponse
}


function buildDefaultHeading2Block(): Heading2BlockObjectResponse {
    return {
        ...buildDefaultBlock(),
        type: 'heading_2',
        heading_2: {
            rich_text: [],
            color: 'default',
            is_toggleable: true
        }
    } as Heading2BlockObjectResponse
}

function buildDefaultHeading3Block(): Heading3BlockObjectResponse {
    return {
        ...buildDefaultBlock(),
        type: 'heading_3',
        heading_3: {
            rich_text: [],
            color: 'default',
            is_toggleable: true
        }
    } as Heading3BlockObjectResponse
}

function buildDefaultBlock(): Partial<BlockObjectResponse> {
    return {
        parent: {
            type: 'page_id',
            page_id: 'page1'
        },
        object: 'block',
        id: 'id',
        created_time: '1234',
        created_by: {
            object: 'user',
            id: 'user'
        },
        last_edited_time: '1234',
        last_edited_by: {
            object: 'user',
            id: 'user'
        },
        has_children: false,
        archived: false,
        in_trash: false
    };
}