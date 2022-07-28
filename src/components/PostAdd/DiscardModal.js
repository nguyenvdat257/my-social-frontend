import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { postAddActions } from '../../store/post-add-slice';
import { Modal } from 'react-bootstrap';

const DiscardModal = () => {
    const dispatch = useDispatch();
    const showDiscardModal = useSelector(state => state.postAdd.showDiscardModal);
    const handleCloseModal = e => {
        dispatch(postAddActions.setShowDiscardModal(false));
    };
    const handleDiscardClick = e => {
        dispatch(postAddActions.closeMainModal());
    };
    return (
        <Modal centered show={showDiscardModal} onHide={handleCloseModal} dialogClassName='modal-custom-post-add'>
            <div className='modal-header-discard-post'>
                <div></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <div style={{fontSize: '1.2rem'}}>Discard post?</div>
                    <div className='fade-text smaller-text'>If you leave, your edits won't be saved</div>
                </div>
                <div></div>
            </div>
            <div>
                <div className='modal-option border-bottom pointer-cursor' style={{fontWeight: 'bold', color: 'red'}} onClick={handleDiscardClick}>Discard</div>
                <div className='modal-option pointer-cursor' onClick={handleCloseModal}>Cancel</div>
            </div>
        </Modal>
    )
}

export default DiscardModal