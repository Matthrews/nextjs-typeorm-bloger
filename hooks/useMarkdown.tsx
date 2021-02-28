// @flow
import * as React from 'react';
import {Editor, Viewer} from 'bytemd';
import gfm from '@bytemd/plugin-gfm';

const plugins = [
    gfm()
    // Add more plugins here
];

export const useMarkdown = () => {
    const [value, setValue] = React.useState('');

    console.log('UseMarkdown', value);
    return (
        <Editor
            value={value}
            plugins={plugins}
            onChange={(v: any) => {
                setValue(v);
            }}
        />
    );
};