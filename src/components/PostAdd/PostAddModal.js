import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import SelectFile from './SelectFile';
import ImageCrop from './ImageCrop';
import { useSelector, useDispatch } from 'react-redux';
import { postAddActions } from '../../store/post-add-slice';
import PostPreview from './PostPreview';
import ConfirmModal from '../Common/ConfirmModal';
import { confirmActions } from '../../store/confirm-modal-slice';

const PostAddModal = () => {
    const dispatch = useDispatch();
    const type = useSelector(state => state.postAdd.type);
    const page = useSelector(state => state.postAdd.page);
    const showMainModal = useSelector(state => state.postAdd.showMainModal);
    const submittedData = useSelector(state => state.postAdd.submittedData);
    const handleCloseModal = () => {
        if (page === 0 || submittedData)
            dispatch(postAddActions.closeMainModal());
        else {
            dispatch(confirmActions.setName('post-add-discard'));
            dispatch(confirmActions.setProps({
                titleMain: `Discard ${type === 'post' ? 'post' : 'story'}?`,
                titleDesc: "If you leave, your edits won't be saved",
                text: "Discard"
            }));
        }
    }
    useEffect(() => {
        dispatch(postAddActions.setType(type));
    }, []);
    return (
        <>
            <Modal centered show={showMainModal} onHide={handleCloseModal} dialogClassName='modal-custom-post-add'>
                {page === 0 && <SelectFile />}
                {page === 1 && <ImageCrop />}
                {page === 2 && <PostPreview />}
            </Modal>
            <ConfirmModal
                handleFn={props => dispatch(postAddActions.closeMainModal())}
                currentName='post-add-discard' />
        </>
    )
}

export default PostAddModal