import React from 'react'
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { confirmActions } from '../../store/confirm-modal-slice';

const ConfirmModal = ({ handleFn, currentName }) => {
    const dispatch = useDispatch();
    const name = useSelector(state => state.confirm.name);
    const props = useSelector(state => state.confirm.props);
    const handleActionClick = e => {
        handleFn(props.handleProps);
        dispatch(confirmActions.setName(''));
    };
    const handleCloseModal = e => {
        dispatch(confirmActions.setName(''));
    }
    return (
        <Modal centered show={name === currentName} onHide={handleCloseModal} dialogClassName='modal-custom-post-add'>
            <div className='modal-header-discard-post' style={{ height: props.titleAvatar ? '8rem' : '6rem' }}>
                <div></div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    {props.titleMain &&
                        <div style={{ fontSize: '1.2rem' }}>{props.titleMain}</div>
                    }
                    {props.titleAvatar &&
                        <img className='avatar confirm-avatar' src={props.titleAvatar} />
                    }
                    <div className='fade-text smaller-text'>{props.titleDesc}</div>
                </div>
                <div></div>
            </div>
            <div>
                <div className='modal-option border-bottom pointer-cursor'
                    style={{ fontWeight: 'bold', color: 'red' }}
                    onClick={handleActionClick}>
                    {props.text}
                </div>
                <div className='modal-option pointer-cursor' onClick={handleCloseModal}>Cancel</div>
            </div>
        </Modal>
    )
}

export default ConfirmModal