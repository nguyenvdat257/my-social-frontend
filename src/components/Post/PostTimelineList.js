import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { callGetData } from '../../store/post-timeline-slice';
import MySpinner from '../Common/Spinner';
import PostTimeline from './PostTimeline';

const PostTimelineList = () => {
    const dispatch = useDispatch()
    const posts = useSelector(state => state.postTimeline.posts);
    const gettingData = useSelector(state => state.postTimeline.gettingData);
    useEffect(() => {
        dispatch(callGetData());
    }, []);
    if (gettingData) {
        <MySpinner />
    }
    else {
        return (
            posts.map((post, index) => (
                <PostTimeline key={index} post={post} />
            ))
        )
    }
}

export default PostTimelineList