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
    if (req.method === 'PATCH') {
        const {id, title, content} = req.body;
        const user = req.session.get('BLOGER_CURRENT_USER');

        // not sign in
        if (!user) {
            res.status(401);
            return res.end();
        }


        const connection = await getDatabaseConnection();
        const post = await connection.manager.createQueryBuilder()
            .update(Post)
            .set({title: title, content: content})
            .where('id = :id', {id})
            .execute();
        res.status(200).json(post);
    }
    if (req.method === 'DELETE') {
        const {query: {id}} = req;
        const user = req.session.get('BLOGER_CURRENT_USER');

        // not sign in
        if (!user) {
            res.status(401);
            return res.end();
        }

        const connection = await getDatabaseConnection();
        const result = await connection.manager.delete(Post, id);
        res.status(result.affected >= 0 ? 200 : 400).json(result);
    }
    res.end();
});

export default Posts;