import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Cropper from 'react-easy-crop'
import { myConfig } from '../../config';
// const createImage = (url) =>
//     new Promise((resolve, reject) => {
//         const image = new Image()
//         image.addEventListener('load', () => resolve(image))
//         image.addEventListener('error', error => reject(error))
//         image.setAttribute('crossOrigin', 'anonymous')
//         image.src = url
//     })

// export const getCroppedImg = async (imageSrc, crop) => {
//     const image = await createImage(imageSrc)
//     const canvas = document.createElement('canvas')
//     const ctx = canvas.getContext('2d')

//     /* setting canvas width & height allows us to 
//     resize from the original image resolution */
//     canvas.width = 250
//     canvas.height = 250

//     ctx.drawImage(
//         image,
//         crop.x,
//         crop.y,
//         crop.width,
//         crop.height,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//     )

//     return new Promise((resolve) => {
//         canvas.toBlob((blob) => {
//             resolve(blob)
//         }, 'image/jpeg')
//     })
// }
const ImageCrop = () => {
    const dispatch = useDispatch();
    const images = useSelector(state => state.postAdd.images);
    const imageLoaded = useSelector(state => state.postAdd.imageLoaded);
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    // const onCropComplete = async (_, croppedAreaPixels) => {
    //     const croppedImage = await getCroppedImg(
    //         inputImg,
    //         croppedAreaPixels
    //     )
    //     getBlob(croppedImage)
    // }
    return (
        <>
            {imageLoaded &&
                // <div style={{ height: '30rem', width: '30rem', overflowX: 'auto' }}>
                //     <img src={URL.createObjectURL(images[0])} />
                // </div>
                <div style={{ position: 'relative', height: '30rem', width: '30rem' }}>
                    <Cropper
                        image={URL.createObjectURL(images[0])}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        // onCropComplete={onCropComplete}
                        objectFit='vertical-cover'
                        onZoomChange={setZoom}
                    />
                </div>
            }
        </>
    )
}

export default ImageCrop