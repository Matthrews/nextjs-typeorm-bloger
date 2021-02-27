import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import 'styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className="home-wrapper">
      <div className="cover">
        <img src="/logo.png" alt="Logo" />
        <h1>我的个人博客网站</h1>
        <p>
          <Link href={`/posts`}>
            <a>文章列表</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Home;
