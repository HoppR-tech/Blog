import type { BlogPost } from '@/types/blog'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export function checkPost(post: BlogPost) {
    checkImage(post.image);
    checkDate(post.date)
    checkContent(post.content)
}

function checkImage(image: string) {
    if (!image)
        throw new Error('Cover image is missing.')
}

function checkDate(date: string) {
    if (!date)
        throw new Error('Date is missing.')

    if (Number.isNaN(new Date(date).getTime()))
        throw new Error('Invalid date provided')
}

function checkContent(content: string) {
    if (!content)
        throw new Error('Content is missing')
}

export function checkBlocks(blocks: BlockObjectResponse[]) {
    const firstBlock = blocks[0];
    if(firstBlock.type != 'heading_1' && firstBlock.type != 'paragraph')
        throw new Error('An article must start with a title or an introduction');

    if(blocks.slice(1).some(b => b.type === 'heading_1'))
        throw new Error('Heading 1 is only permitted at the start of the article content');
}

