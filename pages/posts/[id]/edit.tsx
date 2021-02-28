// @flow
import React from 'react';
import {NextPage, GetServerSideProps} from 'next';
import withSession from 'lib/session';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import matter from 'gray-matter';
import marked from 'marked';
import {useForm} from 'hooks/useForm';
import axios from 'axios';
import {User} from 'src/entity/User';
import {Post} from 'src/entity/Post';
import {useRouter} from 'next/router';

type NewProps = {
    currentUser: User | null
    post: Post
};

const PostEdit: NextPage<NewProps> = ({currentUser, post: {id, title, content}}) => {
    const router = useRouter();
    const {form} = useForm({
        initFormData: {title: title || '', content},
        fields: [
            {label: '标题: ', type: 'text', key: 'title', className: 'post-title'},
            {label: '内容: ', type: 'textarea', key: 'content', className: 'post-content'}
        ],
        buttons: [<button type="submit" className="button button-action button-pill">提交</button>],
        submit: {
            request: formData => axios.patch(`/api/v2/posts`, {...formData, id}),
            success: () => {
                window.alert('提交成功！');
                router.push(`/posts/${id}`);
            }
        }
    });
    return <div className="post-new">
        {form}
        <style jsx global>{`
          .post-new form {
            padding: 1rem 1.5rem;
            display: flex;
            flex-flow: column nowrap;
          }
          .post-new form div{
            margin: .5rem;
          }
          .post-new form .post-title {
            display: flex;
          }
          .post-new form .post-title input{
            //width: 100vw;
            width: calc(100vw - 96px);
            height: 2.1em;
          }
          .post-new form .post-title span {
            white-space: nowrap;
          }
          
          .post-new form .post-content {
            display: flex;
          }
          .post-new form .post-content textarea {
            //width: 100vw;
            width: calc(100vw - 96px);
            height: 24em;  // height=(40/3)*24=320px
          }
          .post-new form .post-content span {
            white-space: nowrap;
            vertical-align: top;
          }
          .post-new form .button {
            margin: 0 2.5rem;
          }
        `}</style>
    </div>;
};


export default PostEdit;


export const getServerSideProps: GetServerSideProps<any, { id: string, session: any }> = withSession(async (context: any) => {
    const connection = await getDatabaseConnection();
    const post = await connection.manager.findOne(Post, context.params.id);
    // resolve markdown
    const {data: {title, date}, content} = matter(post.content),
        html = marked(content);
    const currentUser = (context.req as any).session.get('BLOGER_CURRENT_USER') || null;
    return {
        props: {
            currentUser,
            post: JSON.parse(JSON.stringify({
                id: context.params.id, title, date, content: html
            }))
        }
    };
});