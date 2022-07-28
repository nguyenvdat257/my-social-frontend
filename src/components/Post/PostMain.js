import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { postTimelineActions } from '../../store/post-timeline-slice';
import PostMainSlide from './PostMainSlide';
import PostMainInfo from './PostMainInfo';

const PostMain = ({ post }) => {
    const dispatch = useDispatch()
    const showPostMain = useSelector(state => state.postTimeline.postProps[post.code].showPostMain);
    const handleCloseModal = e => {
        dispatch(postTimelineActions.closePostModal({postCode: post.code}));
    };
    return (
        <Modal centered show={showPostMain} onHide={handleCloseModal} dialogClassName='modal-custom-post'>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', backgroundColor: 'black' }}>
                <div className='post-main-slide'>
                    <PostMainSlide post={post} />
                </div>
                <PostMainInfo post={post} />
            </div>
        </Modal>
    )
}

export default PostMain