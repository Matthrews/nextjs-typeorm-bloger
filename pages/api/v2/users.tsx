// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {NextApiHandler} from 'next';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import {User} from 'src/entity/User';


const Users: NextApiHandler = async (req, res) => {
    const {username, password, passwordConfirmation} = req.body;

    // new User and validate
    // need improvement: too early to md5 password, should just before save user
    const user = new User(username.trim(), '');
    // let user = new User(username.trim(), md5(DIGEST + passwordConfirmation));
    user.password = password;
    user.passwordConfirmation = passwordConfirmation;
    // validate
    await user.validate();
    // handle errors
    if (user.hasErrors()) {
        res.status(422).json(JSON.stringify(user.errors, null, 2));
    } else {
        // save to database
        try {
            // execute md5 function to generate password digest before save
            const connection = await getDatabaseConnection();
            await connection.manager.save(user);
            res.status(200).json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500);
        }
    }
    res.end();
};

export default Users;
