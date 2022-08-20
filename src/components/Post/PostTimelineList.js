import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { callGetData } from '../../store/post-timeline-slice';
import MySpinner from '../Common/Spinner';
import PostTimeline from './PostTimeline';

const PostTimelineList = React.memo(() => {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.postTimeline.posts);
    const gettingData = useSelector(state => state.postTimeline.gettingData);
    useEffect(() => {
        if (posts.length > 0) return;
        dispatch(callGetData('postTimeline'));
    }, []);
    return (
        <>
            {gettingData &&
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <MySpinner />
            </div>
            }
            {!gettingData &&
                posts.map((post, index) => (
                    <PostTimeline key={post.code} post={post} />
                ))

            }
        </>
    )
})

export default PostTimelineList