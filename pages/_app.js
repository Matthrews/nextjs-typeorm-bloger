import React from "react";
import Head from "next/head";
import 'styles/globals.css';

function MyApp({Component, pageProps}) {
    return <div className="app">
        <Head>
            <meta charSet="utf8" version='1'/>
            <title>Oliver的个人博客网站</title>
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"/>
            <meta name="description"
                  content="Oliver-一个简单的个人博客网站!"/>
            <meta name="Keywords" content="博客,Oliver,技术,分享"/>
        </Head>
        <Component {...pageProps} />
    </div>
}

export default MyApp
