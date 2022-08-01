import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BiArrowBack } from 'react-icons/bi'
import { postAddActions, cropRemaining } from '../../store/post-add-slice';
import PostImage from './CropBody';
import { confirmActions } from '../../store/confirm-modal-slice';
import CropBody from './CropBody';

const ImageCrop = () => {
    const dispatch = useDispatch();
    const imageLoaded = useSelector(state => state.postAdd.imageLoaded);
    const images = useSelector(state => state.postAdd.images);
    const croppedImages = useSelector(state => state.postAdd.croppedImages);
    const handleClickBack = e => {
        dispatch(confirmActions.setIsShow(true));
    };
    const handleClickNext = e => {
        dispatch(cropRemaining(croppedImages, images)).then(() => {
            dispatch(postAddActions.setPage(2));
            dispatch(postAddActions.setCurrentImgIndex(0));
        });
    };
    return (
        <>
            {imageLoaded &&
                <>
                    <div className='modal-custom-header' style={{ position: 'relative' }}>
                        <div >
                            <BiArrowBack className='pointer-cursor' onClick={handleClickBack} size={25} style={{ marginLeft: '1rem' }} />
                        </div>
                        <div className='bold-text-medium'>Crop</div>
                        <div className='pointer-cursor' style={{ paddingRight: '1rem', color: 'dodgerblue' }} onClick={handleClickNext}>Next</div>
                    </div>
                    <CropBody />
                </>
            }
        </>
    )
}

export default ImageCrop