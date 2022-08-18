import React, { useState } from 'react'
import { myConfig } from '../../config'
import { AiFillHeart, AiOutlineMessage } from 'react-icons/ai'
import { callGetPost, postActions, postSuggestActions, postUserActions } from '../../store/post-timeline-slice';
import PostMain from '../Post/PostMain';
import { useDispatch, useSelector } from 'react-redux';
const postAction = postActions;
const postSuggestAction = postSuggestActions;
const postUserAction = postUserActions;

const PostListItem = ({ post, type, isClickOpenModal = true }) => {
    const dispatch = useDispatch();
    const actions = eval(type + 'Action');
    const [showInfo, setShowInfo] = useState(false);
    const showPostMain = useSelector(state => state[type].postProps[post.code]?.showPostMain);
    const detailPost = useSelector(state => state[type].posts.filter(p => p.code === post.code)[0]);
    const handleMouseOver = e => {
        setShowInfo(true);
    };
    const handleMouseOut = e => {
        setShowInfo(false);
    };
    const handleClickImage = e => {
        if (isClickOpenModal) {
            dispatch(callGetPost(type, post.code)).then(() =>
                dispatch(actions.setShowPostMain({ postCode: post.code, value: true }))
            );
        } else {
            dispatch(callGetPost(type, post.code)).then(() => {
                window.scrollTo(0, 0);
                dispatch(actions.swapPostWithTop({postCode: post.code}));
            });
        }
    };
    return (
        <>
            {(post && (post.image || post.images)) &&
                <div className='pointer-cursor' style={{ position: 'relative' }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleClickImage}>
                    <img style={{ width: '19rem', height: '19rem' }} src={post.image ? myConfig.mediaHost + post.image.image : myConfig.mediaHost + post.images[0].image} />
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
                < PostMain post={detailPost} type={type} />}
        </>
    )
}

export default PostListItem