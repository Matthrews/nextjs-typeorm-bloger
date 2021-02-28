import {NextPage} from 'next';
import Link from 'next/link';
import React from 'react';
import 'styles/Home.module.css';

const Home: NextPage = () => {
    return (
        <div className="home-wrapper">
            <h1>我的个人博客网站</h1>
            <h4>
                <Link href={`/posts`}><a>文章列表</a></Link>
            </h4>
            <style jsx>{`
                .home-wrapper {
                    min-height: 100vh;
                    padding: 0 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </div>
    );
};

export default Home;
