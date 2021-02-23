// @flow
import React from 'react';
import {GetServerSideProps, NextPage} from 'next';
import Link from 'next/link';
import {Post} from 'src/entity/Post';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import qs from 'querystring';
import usePager from 'hooks/usePager';

type PostProps = {
    posts: Post[],
    count: number,
    page: number,
    totalPage: number,
    pageSize: number
};

const PAGE_SIZE = 2;


const Posts: NextPage<PostProps> = ({posts, count, page, totalPage}) => {
    const {pager} = usePager({count, page, totalPage});
    return (
        <div className="post-page">
            <h1>文章列表</h1>
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
            <footer>
                {pager}
            </footer>
        </div>
    );
};


export default Posts;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const connection = await getDatabaseConnection();
    const index = context.req.url.indexOf('?');
    const queryStr = qs.parse(context.req.url.substr(index + 1));
    const page = parseInt(queryStr.page as string) || 1;
    const [posts, count] = await connection.manager.findAndCount(Post, {skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE});
    return {
        props: {
            posts: JSON.parse(JSON.stringify(posts)),
            count,
            page,
            pageSize: PAGE_SIZE,
            totalPage: Math.ceil(count / PAGE_SIZE)
        }
    };
};