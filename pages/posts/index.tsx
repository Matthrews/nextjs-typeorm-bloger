// @flow
import React from 'react';
import {GetServerSideProps, NextPage, GetServerSidePropsContext} from 'next';
import Link from 'next/link';
import {Post} from 'src/entity/Post';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import qs from 'querystring';
import usePager from 'hooks/usePager';
import withSession from 'lib/session';
import {User} from 'src/entity/User';

type PostProps = {
    posts: Post[],
    count: number,
    page: number,
    totalPage: number,
    pageSize: number,
    currentUser: User | null
};

const PAGE_SIZE = 5;


const Posts: NextPage<PostProps> = ({currentUser, posts, count, page, totalPage}) => {
    const {pager} = usePager({count, page, totalPage});
    return (
        <>
            <div className="post-page">
                <header>
                    <h1>文章列表</h1>
                    {
                        currentUser && <Link href={`/posts/new`}>
                            <button className="button button-action button-pill">新增文章</button>
                        </Link>
                    }
                </header>
                <main>
                    <div className="post-wrapper">
                        {
                            posts.map(({id, title}) => <p key={id}>
                                    <Link href={'/posts/[id]'} as={`/posts/${id}`}><a>{title}</a></Link>
                                </p>
                            )
                        }
                    </div>
                </main>
                {
                    totalPage > 1 ? <footer> {pager}</footer> : null
                }
            </div>
            <style jsx>{`
              .post-page {
                padding: 0 1.5rem;
              }
              .post-wrapper {
                background: antiquewhite;
              }
            `}</style>
        </>
    );
};


export default Posts;


export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
    const connection = await getDatabaseConnection();
    const index = context.req.url.indexOf('?');
    const queryStr = qs.parse(context.req.url.substr(index + 1));
    const page = parseInt(queryStr.page as string) || 1;
    const [posts, count] = await connection.manager.findAndCount(Post, {skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE});
    const currentUser = (context.req as any).session.get('BLOGER_CURRENT_USER') || null;
    return {
        props: {
            currentUser,
            count,
            page,
            pageSize: PAGE_SIZE,
            totalPage: Math.ceil(count / PAGE_SIZE),
            posts: JSON.parse(JSON.stringify(posts))
        }
    };
});
