// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiHandler} from 'next';
import {getPost} from 'lib/post';

const Post: NextApiHandler = async (req, res) => {
    const posts = await getPost();
    res.status(200).json(JSON.stringify(posts, null, 2));
};

export default Post;
