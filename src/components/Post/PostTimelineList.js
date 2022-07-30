import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { callGetData } from '../../store/post-timeline-slice';
import MySpinner from '../Common/Spinner';
import PostTimeline from './PostTimeline';
import { callDeletePost } from '../../store/post-timeline-slice';
import PostModals from './PostModals';

const PostTimelineList = React.memo(() => {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.postTimeline.posts);
    useEffect(() => {
        dispatch(callGetData());
    }, []);
    return (
        <>
            {
                posts.map((post, index) => (
                    <PostTimeline key={post.code} post={post} />
                ))

            }
            <PostModals />
        </>
    )
})

export default PostTimelineList