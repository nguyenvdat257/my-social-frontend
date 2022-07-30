import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BiArrowBack } from 'react-icons/bi'
import PostForm from './PostForm';
import MySpinner from '../Common/Spinner';
import { AiOutlineCheck } from 'react-icons/ai'
import { postAddActions, callPostAdd, callStoryAdd } from '../../store/post-add-slice';
import PostImage from '../Common/PostImage';

const PostPreview = () => {
    const dispatch = useDispatch();
    const type = useSelector(state => state.postAdd.type);
    const [message, setMessage] = useState('');
    const croppedImages = useSelector(state => state.postAdd.croppedImages);
    const sendingData = useSelector(state => state.postAdd.sendingData);
    const submittedData = useSelector(state => state.postAdd.submittedData);

    const handleClickBack = e => {
        dispatch(postAddActions.setPage(1));
    };
    const handleClickShare = e => {
        e.preventDefault()
        let formData = new FormData();
        formData.append('body', message);
        for (const image of croppedImages)
            formData.append('images', image, 'img.png');
        if (type === 'post')
            dispatch(callPostAdd(formData));
        else
            dispatch(callStoryAdd(formData));
    };
    return (
        <>
            <div className='modal-custom-header'>
                <div >
                    {!submittedData &&
                        <BiArrowBack className='pointer-cursor' onClick={handleClickBack} size={25} style={{ marginLeft: '1rem' }} />
                    }
                </div>
                <div className='bold-text'>{`${submittedData ? `${type === 'post' ? 'Post' : 'Story'} shared` :
                    `Create new ${type === 'post' ? 'post' : 'story'}`}`}</div>
                <div className='pointer-cursor' style={{ marginRight: '1rem', color: 'dodgerblue' }}
                    onClick={handleClickShare}>{`${submittedData ? '' : 'Share'}`}</div>
            </div>
            {
                !sendingData && !submittedData &&
                <div style={{ display: 'flex' }}>
                    <PostImage
                        images={croppedImages.map((croppedImage, index) => URL.createObjectURL(croppedImage))}
                        type='blob' />
                    <PostForm message={message} setMessage={setMessage} />
                </div>
            }
            {sendingData &&
                <div style={{ position: 'relative', height: '30rem', width: '30rem' }}>
                    <MySpinner type={'large'} />
                </div>
            }
            {submittedData &&
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '30rem', width: '30rem' }}>
                    <AiOutlineCheck size={40} style={{ marginBottom: '1rem' }} />
                    <div className='fade-text larger-text'>Your {type === 'post' ? 'post' : 'story'} has been shared.</div>
                </div>
            }
        </>
    )
}

export default PostPreview