import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Cropper from 'react-easy-crop'
import { postAddActions } from '../../store/post-add-slice';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

export const getCroppedImg = async (img, crop) => {
    const image = await createImage(img.src)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    /* setting canvas width & height allows us to 
    resize from the original image resolution */
    // canvas.width = img.width
    // canvas.height = img.height
    canvas.width = crop.width
    canvas.height = crop.height

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height
    )

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob)
        }, 'image/jpeg')
    })
}

const PostImage = ({ isCrop }) => {
    const dispatch = useDispatch();
    const images = useSelector(state => state.postAdd.images);
    const currentImgIndex = useSelector(state => state.postAdd.currentImgIndex);
    const currentImg = useSelector(state => state.postAdd.images.length > 0 ?
        state.postAdd.images[state.postAdd.currentImgIndex] : null);
    const currentCroppedImg = useSelector(state => state.postAdd.croppedImages.length > 0 ?
        state.postAdd.croppedImages[state.postAdd.currentImgIndex] : null);
    const crop = useSelector(state => state.postAdd.crops.length > 0 ?
        state.postAdd.crops[state.postAdd.currentImgIndex] : null);
    const zoom = useSelector(state => state.postAdd.zooms.length > 0 ?
        state.postAdd.zooms[state.postAdd.currentImgIndex] : null);
    const onCropComplete = async (_, croppedAreaPixels) => {
        const croppedImage = await getCroppedImg(currentImg, croppedAreaPixels)
        dispatch(postAddActions.setCroppedImg(croppedImage));
    }
    const setCrop = crop => {
        dispatch(postAddActions.setCrop(crop));
    };
    const setZoom = crop => {
        dispatch(postAddActions.setZoom(crop));
    };
    const handleClickBackImg = e => {
        const idx = currentImgIndex === 0 ? images.length - 1 : currentImgIndex - 1;
        dispatch(postAddActions.setCurrentImgIndex(idx));
    };
    const handleClickNextImg = e => {
        dispatch(postAddActions.setCurrentImgIndex((currentImgIndex + 1) % images.length));
    };
    return (
        <div style={{ position: 'relative', height: '30rem', width: '30rem' }}>
            {images.length > 1 &&
                <>
                    <div className='post-add-next-button-position' display='flex'>
                        <IoIosArrowBack className='post-add-next-button pointer-cursor' size={30} onClick={handleClickBackImg} />
                        <IoIosArrowForward className='post-add-next-button pointer-cursor' size={30} style={{ marginLeft: '0.5rem' }} onClick={handleClickNextImg} />
                    </div>
                    <div className='post-add-locator-position' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        {
                            images.map((image, index) => (
                                <div className='post-add-locator' style={{ backgroundColor: index === currentImgIndex ? 'dodgerblue' : 'white' }}></div>
                            ))
                        }
                    </div>
                </>
            }
            {isCrop &&
                <Cropper
                    image={currentImg.src}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    objectFit={`${currentImg.width > currentImg.height ? 'vertical-cover' : 'horizontal-cover'}`}
                    onZoomChange={setZoom}
                />}
            {!isCrop &&
                <div style={{ position: 'relative', height: '30rem', width: '30rem' }}>
                    <img src={URL.createObjectURL(currentCroppedImg)} style={{ width: '30rem', height: '30rem' }}></img>
                </div>
            }
        </div>
    )
}

export default PostImage