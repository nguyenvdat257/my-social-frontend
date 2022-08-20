import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import ProfileAvatar from '../Common/ProfileAvatar';
import { useNavigate } from 'react-router-dom';
import { notificationActions } from '../../store/notification-slice';
import { myConfig } from '../../config';
import { clickActions } from '../../store/click-slice';


const NotificationItem = ({ item }) => {
    const dispatch = useDispatch();
    const avatarRef = useRef(null);
    const navigate = useNavigate();
    const handleClickItem = e => {
        // dispatch(notificationActions.setShowNoti(false));
        if (!avatarRef.current || !avatarRef.current.contains(e.target)) {
            if (item.post) {
                navigate(`/posts/${item.post.code}`);
            }
            else {
                navigate(`/profiles/${item.sender_profile.username}`);
            }
        }
        dispatch(clickActions.setIsClickable(true));
        dispatch(notificationActions.setShowNoti(false));
    };
    return (
        <div className='modal-item search-item pointer-cursor' style={{ paddingBottom: '1rem' }} onClick={handleClickItem}>
            <div style={{ display: 'flex', alignItems: 'center', maxWidth: '85%' }}>
                <div ref={avatarRef} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ProfileAvatar profile={item.sender_profile} avatarSize='medium' isShowDetail={false} margin='0rem' isEnableHover={false} />
                </div>
                <div style={{ marginLeft: '0.5rem', maxWidth: '85%', lineHeight: '0.7rem', overflowWrap: 'break-word' }}>
                    <span className='bold-text-small' >{item.sender_profile.username}</span>
                    {item.type === 'like_comment' &&
                        <span className='smaller-text'> liked your comment: {item.comment.body} </span>
                    }
                    {item.type === 'mention_comment' &&
                        <span className='smaller-text'> mentioned you in a comment:</span>
                    }
                    {item.type === 'like_post' &&
                        <span className='smaller-text'> like your post:</span>
                    }
                    {item.type === 'comment_post' &&
                        <span className='smaller-text'> comment on your post: {item.comment.body}</span>
                    }
                    {item.type === 'following' &&
                        <span className='smaller-text'> started following you:</span>
                    }
                </div>
            </div>
            {item.type !== 'following' && item.post.image &&
                <img src={myConfig.mediaHost + item.post.image.image.small} style={{ width: '2rem', height: '2rem' }} alt='post' />
            }
        </div>
    )
}

export default NotificationItem