import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { postTimelineActions, postActions, postSuggestActions } from '../../store/post-timeline-slice';
import PostMainBody from './PostMainBody';
const postAction = postActions;
const postTimelineAction = postTimelineActions;
const postSuggestAction = postSuggestActions;

const PostMain = ({ post, type }) => {
    const dispatch = useDispatch()
    const actions = eval(type + 'Action');
    const showPostMain = useSelector(state => state[type].postProps[post.code].showPostMain);
    const handleCloseModal = e => {
        dispatch(actions.closePostModal({ postCode: post.code }));
    };
    return (
        <Modal centered show={showPostMain} onHide={handleCloseModal} dialogClassName='modal-custom-post'>
            <PostMainBody post={post} type={type} />
        </Modal>
    )
}

export default PostMain