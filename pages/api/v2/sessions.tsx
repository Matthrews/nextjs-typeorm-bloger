import {SignIn} from 'src/model/SignIn';
import withSession from 'lib/session';
import {NextApiHandler} from 'next';

const Sessions: NextApiHandler = async (req, res) => {
    const {username, password} = req.body;

    const signIn = new SignIn(username, password);
    await signIn.validate();
    const hasErrors = signIn.hasErrors();
    if (hasErrors) {
        res.status(422).json(signIn.errors);
    } else {
        req.session.set('BLOGER_CURRENT_USER', signIn.user);
        await req.session.save();
        res.status(200).json(signIn.user);
    }
    res.end();
};

export default withSession(Sessions);