import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostForm from '../PostAdd/PostForm';
import PostImage from '../Common/PostImage';
import { Modal } from 'react-bootstrap';
import { postEditActions } from '../../store/post-edit-slice';
import { callEditPost } from '../../store/post-timeline-slice';
import { optionActions } from '../../store/option-modal-slice';

const PostEdit = ({ currentName }) => {
    const dispatch = useDispatch();
    const name = useSelector(state => state.postEdit.name);
    const props = useSelector(state => state.postEdit.props);
    const [message, setMessage] = useState('');

    const handleCloseModal = e => {
        dispatch(postEditActions.setName(''));
        dispatch(optionActions.setName(''));
    }
    const handleClickDone = e => {
        e.preventDefault()
        let formData = new FormData();
        formData.append('body', message);
        dispatch(callEditPost(formData, props.post.code));
        dispatch(postEditActions.setName(''));
        dispatch(optionActions.setName(''));
    };
    useEffect(() => {
        if (props.post)
            setMessage(props.post.body);
    }, [name])
    return (
        <>
            <Modal centered show={name === currentName} onHide={handleCloseModal} dialogClassName='modal-custom-post-add'>
                <div className='modal-custom-header'>
                    <div >
                        <div className='pointer-cursor' onClick={handleCloseModal} style={{ marginLeft: '1rem' }}>
                            Cancel
                        </div>
                    </div>
                    <div className='bold-text'>
                        Edit info
                    </div>
                    <div className='pointer-cursor' style={{ marginRight: '1rem', color: 'dodgerblue' }}
                        onClick={handleClickDone}>
                        Done
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <PostImage images={props.post?.images.map(image => image.image)} />
                    <PostForm message={message} setMessage={setMessage} />
                </div>
            </Modal>
        </>
    )
}

export default PostEdit