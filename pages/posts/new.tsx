// @flow
import React from 'react';
import {NextPage} from 'next';
import {useForm} from 'hooks/useForm';
import axios from 'axios';


const PostNew: NextPage = () => {
    const {form} = useForm({
        initFormData: {title: '', content: ''},
        fields: [
            {label: '标题: ', type: 'text', key: 'title'},
            {label: '内容: ', type: 'textarea', key: 'content'}
        ],
        buttons: [<button type="submit">提交</button>],
        submit: {
            request: formData => axios.post(`/api/v2/posts`, formData),
            success: () => {
                window.alert('提交成功！');
                window.location.href = '/posts';
            }
        }
    });

    return <div>{form}</div>;
};


export default PostNew;