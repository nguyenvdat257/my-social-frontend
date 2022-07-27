import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import SelectFile from './SelectFile';
import ImageCrop from './ImageCrop';
import { useSelector, useDispatch } from 'react-redux';
import { postAddActions } from '../../store/post-add-slice';

const PostAddModal = () => {
    const dispatch = useDispatch();
    const page = useSelector(state => state.postAdd.page);
    const showMainModal = useSelector(state => state.postAdd.showMainModal);
    const handleCloseModal = () => {
        dispatch(postAddActions.closeMainModal());
    }
    return (
        <Modal centered show={showMainModal} onHide={handleCloseModal} dialogClassName='modal-custom-post-add'>
            {page === 0 &&
                <>
                    <div className='modal-custom-header'><div>Create new post</div></div>
                    <SelectFile />
                </>}
            {page === 1 &&
                <>
                    <div className='modal-custom-header'><div>Crop</div></div>
                    <ImageCrop />
                </>}
        </Modal>
    )
}

export default PostAddModal