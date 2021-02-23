import {NextApiHandler} from 'next';
import {Post} from 'src/entity/Post';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import withSession from 'lib/session';

const Posts: NextApiHandler = withSession(async (req, res) => {
    if (req.method === 'POST') {
        const {title, content} = req.body;
        const user = req.session.get('BLOGER_CURRENT_USER');

        // not sign in
        if (!user) {
            res.status(401);
            return res.end();
        }

        const post = new Post(user.id, title, content);

        const connection = await getDatabaseConnection();
        await connection.manager.save(post);

        res.status(200).json(post);
    }
    res.end();
});

export default Posts;