// @flow 
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Post } from 'src/entity/Post';

const usePost = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [isEmpty, setEmpty] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios.get('/api/post').then(res => {
            setTimeout(() => {
                if (!res.data || !res.data.length) {
                    setEmpty(true);
                }
                setPosts(res.data);
                setLoading(false);
            }, 3000); // 延长3m
        }, () => {
            setLoading(false);
        });
    }, []);
    return {
        isLoading, isEmpty, posts
    };
};

export default usePost;