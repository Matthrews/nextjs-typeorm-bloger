import React from "react";
import Head from "next/head";
import 'styles/globals.css'

function MyApp({ Component, pageProps }) {
    return <div className="app">
        <Head>
            <meta charSet="utf8" version='1' />
            <title>京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！</title>
            <meta name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
            <meta name="description"
                content="京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!" />
            <meta name="Keywords" content="网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东" />
        </Head>
        <Component {...pageProps} />
    </div>
}

export default MyApp
