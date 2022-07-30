import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { optionActions } from '../../store/option-modal-slice';
import { callFollow } from '../../store/post-timeline-slice';
import { getAvatarSrc } from '../../utils/CommonFunction';
import { confirmActions } from '../../store/confirm-modal-slice';

const PostHeader = ({ post, isTimeline }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const handleClickThreeDot = e => {
        if (post.profile_info.username === user.username) {
            dispatch(optionActions.setName('post-my'));
            dispatch(optionActions.setProps({ 
                post: post
            }));
        } else if (post.profile_info.is_follow) {
            dispatch(optionActions.setName('post-other'));
            dispatch(optionActions.setProps({
                post:post
            }))
        }
    }
    const handleUnfollow = post => e => {
        dispatch(confirmActions.setProps({
            titleAvatar: getAvatarSrc(post.profile_info, 'large'),
            titleDesc: `Unfollow @${post.profile_info.username}?`,
            text: 'Unfollow',
            username: post.profile_info.username,
            postCode: post.code
        }));
        dispatch(confirmActions.setName('post-unfollow'));
    }
    return (
        <>
            <div className={`${isTimeline ? 'post-header' : 'post-header-main'}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img className='avatar post-header-avatar' src={getAvatarSrc(post.profile_info, 'small')} />
                    <div className={`${isTimeline ? 'post-header-username' : 'post-header-username-main'} post-username`}>
                        {post.profile_info.username}
                    </div>
                    {
                        !post.profile_info.is_follow && post.profile_info.username != user.username &&
                        <div>
                            <span style={{ marginLeft: '0.5rem' }}>•</span>
                            <span className='smaller-text bold-text pointer-cursor'
                                style={{ marginLeft: '0.5rem', color: 'dodgerblue' }}
                                onClick={() => dispatch(callFollow(post.profile_info.username, post.code))}
                            >Follow</span>
                        </div>
                    }
                    {
                        !isTimeline && post.profile_info.is_follow && post.profile_info.username != user.username &&
                        <div>
                            <span style={{ marginLeft: '0.5rem' }}>•</span>
                            <span className='smaller-text bold-text pointer-cursor'
                                style={{ marginLeft: '0.5rem' }}
                                onClick={handleUnfollow(post)}
                            >Following</span>
                        </div>
                    }
                </div>
                <div className='pointer-cursor' onClick={handleClickThreeDot}>
                    <BsThreeDots />
                </div>
            </div>
        </>
    )

}

export default PostHeader