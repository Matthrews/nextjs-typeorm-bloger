// @flow
import * as React from 'react';
import axios from 'axios';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import withSession from 'lib/session';
import {User} from 'src/entity/User';
import {useForm} from 'hooks/useForm';
import qs from 'querystring';

const SignIn: NextPage<{ user: User }> = ({user}) => {
    const {form} = useForm({
        initFormData: {username: '', password: ''},
        fields: [
            {label: '用户名: ', type: 'text', key: 'username'},
            {label: '密码: ', type: 'password', key: 'password'}
        ],
        buttons: [<button type="submit">登录</button>],
        submit: {
            request: formData => axios.post(`/api/v2/sessions`, formData),
            success: () => {
                window.alert('登录成功！');
                const query = qs.parse(window.location.search.substr(1));
                window.location.href = query.return_to as string || '/posts';
            }
        }
    });

    return (
        <div>
            {
                user.username && <p>当前登录用户为：{user.username}</p>
            }
            <h1>登录</h1>
            {form}
        </div>
    );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
    // @ts-ignore
    const user = context.req.session.get('BLOGER_CURRENT_USER');
    return {
        props: {
            user: JSON.parse(JSON.stringify(user || ''))
        }
    };
});
