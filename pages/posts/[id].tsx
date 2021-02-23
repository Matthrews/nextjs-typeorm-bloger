// @flow
import React from 'react';

import {GetServerSideProps, NextPage} from 'next';
import getDatabaseConnection from 'lib/getDatabaseConnection';
import {Post} from 'src/entity/Post';
import matter from 'gray-matter';
import marked from 'marked';

type DetailProps = {
    post: Post
};

const Detail: NextPage<DetailProps> = ({post}) => {
    const {title, content} = post;
    return (
        // SEO不认识div的
        <div>
            <h1>{title}</h1>
            {/* 将string转成html内嵌*/}
            <article dangerouslySetInnerHTML={{__html: content}}/>
        </div>
    );
};

export default Detail;


export const getServerSideProps: GetServerSideProps<any, { id: string }> = async (context) => {
    const connection = await getDatabaseConnection();
    const post = await connection.manager.findOne(Post, context.params.id);
    // resolve markdown
    const {data: {title, date}, content} = matter(post.content),
        html = marked(content);
    return {
        props: {
            post: JSON.parse(JSON.stringify({
                title, date, content: html
            }))
        }
    };
};
