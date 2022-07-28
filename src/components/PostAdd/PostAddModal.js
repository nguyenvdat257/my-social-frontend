import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import SelectFile from './SelectFile';
import ImageCrop from './ImageCrop';
import { useSelector, useDispatch } from 'react-redux';
import { postAddActions } from '../../store/post-add-slice';
import DiscardModal from './DiscardModal';
import PostPreview from './PostPreview';

const PostAddModal = () => {
    const dispatch = useDispatch();
    const type = useSelector(state => state.postAdd.type);
    const page = useSelector(state => state.postAdd.page);
    const showMainModal = useSelector(state => state.postAdd.showMainModal);
    const submittedData = useSelector(state => state.postAdd.submittedData);
    const handleCloseModal = () => {
        if (page === 0 || submittedData)
            dispatch(postAddActions.closeMainModal());
        else
            dispatch(postAddActions.setShowDiscardModal(true));
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
            <DiscardModal />
        </>
    )
}

export default PostAddModal