import React, {useState} from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { myConfig } from '../../config';


const PostImage = ({ images, type }) => {
    const [imgIdx, setImgIdx] = useState(0);
    const currentImg = images[imgIdx]
    const handleClickBackImg = e => {
        const idx = imgIdx === 0 ? images.length - 1 : imgIdx - 1;
        setImgIdx(idx);
    };
    const handleClickNextImg = e => {
        setImgIdx((imgIdx + 1) % images.length);
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
                                <div className='post-add-locator' key={index} style={{ backgroundColor: index === imgIdx ? 'dodgerblue' : 'white' }}></div>
                            ))
                        }
                    </div>
                </>
            }
            <div style={{ position: 'relative', height: '30rem', width: '30rem' }}>
                <img src={type==='blob' ? currentImg : myConfig.hostName + currentImg} style={{ width: '30rem', height: '30rem' }}></img>
            </div>

        </div>
    )
}

export default PostImage