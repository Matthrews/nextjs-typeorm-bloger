// @flow
import React from 'react';
import {NextPage} from 'next';
import {useForm} from 'hooks/useForm';
import axios from 'axios';

const PostNew: NextPage = () => {
    const {form} = useForm({
        initFormData: {title: '', content: ''},
        fields: [
            {label: '标题: ', type: 'text', key: 'title', className: 'post-title'},
            {label: '内容: ', type: 'textarea', key: 'content', className: 'post-content'}
        ],
        buttons: [<button type="submit" className="button button-action button-pill">提交</button>],
        submit: {
            request: formData => axios.post(`/api/v2/posts`, formData),
            success: () => {
                window.alert('提交成功！');
                window.location.href = '/posts';
            }
        }
    });

    return <div className="post-new">
        {form}
        <style jsx global>{`
          .post-new form {
            padding: 1rem 1.5rem;
            display: flex;
            flex-flow: column nowrap;
          }
          .post-new form div{
            margin: .5rem;
          }
          .post-new form .post-title {
            display: flex;
          }
          .post-new form .post-title input{
            //width: 100vw;
            width: calc(100vw - 96px);
            height: 2.1em;
          }
          .post-new form .post-title span {
            white-space: nowrap;
          }
          
          .post-new form .post-content {
            display: flex;
          }
          .post-new form .post-content textarea {
            //width: 100vw;
            width: calc(100vw - 96px);
            height: 24em;  // height=(40/3)*24=320px
          }
          .post-new form .post-content span {
            white-space: nowrap;
            vertical-align: top;
          }
          .post-new form .button {
            margin: 0 2.5rem;
          }
        `}</style>
    </div>;
};


export default PostNew;