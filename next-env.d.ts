/// <reference types="next" />
/// <reference types="next/types/global" />

import {Session} from 'next-iron-session';
import {NextApiRequest} from 'next';
import {ParsedUrlQuery} from 'querystring';
import {IncomingMessage, ServerResponse} from 'http';
import {NextApiRequestCookies} from 'next/dist/next-server/server/api-utils';

declare module '*.png' {
    const value: any;
    export default value;
}

type Post = {
    id: string,
    title: string,
    date: Date
    content: string
}

// Extend the next.js types
declare module 'next' {
    // session support
    interface NextApiRequest extends NextApiRequest {
        session?: Session
    }
}
