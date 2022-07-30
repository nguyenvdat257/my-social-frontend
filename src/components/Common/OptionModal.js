import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { postAddActions } from '../../store/post-add-slice';
import { Modal } from 'react-bootstrap';
import { optionActions } from '../../store/option-modal-slice';

const OptionModal = ({ options, currentName }) => {
    const dispatch = useDispatch();
    const name = useSelector(state => state.option.name);
    const props = useSelector(state => state.option.props);
    const handleCloseModal = e => {
        dispatch(optionActions.setName(''));
    }

    return (
        <Modal centered show={currentName === name} onHide={handleCloseModal} dialogClassName='modal-custom-post-add'>
            <div>
                {
                    options.map((option, index) => (
                        <div className={`modal-option border-bottom pointer-cursor`}
                            key={index}
                            style={option.type === 'danger' ? { fontWeight: 'bold', color: 'red' } : {}}
                            onClick={() => option.handleFn(props)}>{option.text}</div>
                    ))
                }
                <div className='modal-option pointer-cursor' onClick={handleCloseModal} key={options.length}>
                    Cancel
                </div>
            </div>
        </Modal >
    )
}

export default OptionModal