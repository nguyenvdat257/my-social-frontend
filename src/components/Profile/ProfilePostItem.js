import React, { useState } from 'react'
import { myConfig } from '../../config'
import { AiFillHeart, AiOutlineMessage } from 'react-icons/ai'
import { callGetPost } from '../../store/post-slice';
import PostMain from '../Post/PostMain';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '../../store/post-timeline-slice';

const ProfilePostItem = ({ post }) => {
    const dispatch = useDispatch();
    const [showInfo, setShowInfo] = useState(false);
    const showPostMain = useSelector(state => state.post.postProps[post.code]?.showPostMain);
    const detailPost = useSelector(state => state.post.posts.filter(p => p.code === post.code)[0]);
    const handleMouseOver = e => {
        setShowInfo(true);
    };
    const handleMouseOut = e => {
        setShowInfo(false);
    };
    const handleClickImage = e => {
        dispatch(callGetPost(post.code)).then(() =>
            dispatch(postActions.setShowPostMain({ postCode: post.code, value: true }))
        );
    };
    return (
        <>
            {(post && (post.image || post.images)) &&
                <div className='pointer-cursor' style={{ position: 'relative' }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleClickImage}>
                    <img style={{ width: '19rem', height: '19rem' }} src={post.image ? myConfig.hostName + post.image.image : myConfig.hostName + post.images[0].image} />
                    {showInfo &&
                        <>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black', opacity: 0.4 }}>
                            </div>
                            <div className='center-item bold-text-medium' style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, color: 'white' }}>
                                <div className='center-item-vertical'>
                                    <div className='center-item-vertical'><AiFillHeart size={20} /> </div>
                                    <div style={{ marginLeft: '0.5rem' }}>{post.likes_count}</div>
                                </div>
                                <div className='center-item-vertical' style={{ marginLeft: '1rem' }}>
                                    <div className='center-item-vertical'><AiOutlineMessage size={20} /> </div>
                                    <div style={{ marginLeft: '0.5rem' }}>{post.comments_count}</div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            }
            {showPostMain && 
                < PostMain post={detailPost} type='post' />}
        </>
    )
}

export default ProfilePostItem