// @flow
import React from 'react';

import {GetServerSideProps, NextPage, GetServerSidePropsContext} from 'next';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import {Post} from 'src/entity/Post';
import matter from 'gray-matter';
import marked from 'marked';
import 'github-markdown-css/github-markdown.css';
import Link from 'next/link';
import withSession from 'lib/session';
import {User} from 'src/entity/User';

type DetailProps = {
    currentUser: User | null
    post: Post
};

const Detail: NextPage<DetailProps> = ({currentUser, post}) => {
    const {id, title, content} = post;
    return (
        // SEO不认识div的
        <div className="post-detail">
            <header>
                <h1>{title}</h1>
                {
                    currentUser && <Link href={'/posts/[id]/edit'} as={`/posts/${id}/edit`}>
                        <button className="button button-action button-pill">编辑文章</button>
                    </Link>
                }
            </header>
            {/* 将string转成html内嵌*/}
            <article className="markdown-body" dangerouslySetInnerHTML={{__html: content}}/>
            <style jsx>{`
                .markdown-body {
                     box-sizing: border-box;
                     min-width: 200px;
                     max-width: 980px;
                     margin: 0 auto;
                     padding: 45px;
                }
                
                @media (max-width: 767px) {
                     .markdown-body {
                        padding: 15px;
                     }
                }
            `}</style>
        </div>
    );
};

export default Detail;


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
