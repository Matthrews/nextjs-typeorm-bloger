// @flow
import * as React from 'react';
import Link from 'next/link';
import _ from 'lodash';

type usePagerProps = {
    count: number,
    page: number,
    totalPage: number,
    _urlMaker?: (n: number) => string
};

const defaultUrlMaker = (num: number) => `/posts?page=${num}`;

const usePager = (options: usePagerProps) => {
    const {page, totalPage, _urlMaker} = options;
    const urlMaker = _urlMaker || defaultUrlMaker;
    const numbers = [];
    numbers.push(1);
    for (let i = page - 3; i <= page + 3; i++) {
        numbers.push(i);
    }
    numbers.push(totalPage);
    const pageNumbers = _.uniq(numbers).sort().filter(n => n >= 1 && n <= totalPage)
        .reduce((acc, cur) => cur - (acc[acc.length - 1] || 0) === 1 ? [...acc, cur] : [...acc, -1, cur], []);
    const pager = <div>
        {page === 1 ? <span>{'<'}</span> : <Link key={page - 1} href={urlMaker(page - 1)}><a>{'<'}</a></Link>}
        {pageNumbers.map(num => num === -1 ? <span key={num}>....</span> : (
                num === page ? <span key={num}>&nbsp;{num}&nbsp;</span> :
                    <Link key={num} href={urlMaker(num)}><a>&nbsp;{num}&nbsp;</a></Link>
            )
        )}
        {page === totalPage ? <span>{'>'}</span> : <Link key={page + 1} href={urlMaker(page + 1)}><a> {'>'}</a></Link>}
        <span>&nbsp;第{page} / {totalPage}页</span>
    </div>;

    return {pager};
};

export default usePager;

