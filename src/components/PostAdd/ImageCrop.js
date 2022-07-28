import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BiArrowBack } from 'react-icons/bi'
import { postAddActions } from '../../store/post-add-slice';
import PostImage from './PostImage';

const ImageCrop = () => {
    const dispatch = useDispatch();
    const imageLoaded = useSelector(state => state.postAdd.imageLoaded);
    const handleClickBack = e => {
        dispatch(postAddActions.setShowDiscardModal(true));
    };
    const handleClickNext = e => {
        dispatch(postAddActions.setPage(2));
        dispatch(postAddActions.setCurrentImgIndex(0));
    };
    return (
        <>
            {imageLoaded &&
                <>
                    <div className='modal-custom-header' style={{ position: 'relative' }}>
                        <div >
                            <BiArrowBack className='pointer-cursor' onClick={handleClickBack} size={25} style={{ marginLeft: '1rem' }} />
                        </div>
                        <div className='bold-text'>Crop</div>
                        <div className='pointer-cursor' style={{ paddingRight: '1rem', color: 'dodgerblue' }} onClick={handleClickNext}>Next</div>
                    </div>
                    <PostImage isCrop={true} />
                </>
            }
        </>
    )
}

export default ImageCrop