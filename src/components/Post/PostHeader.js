import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { optionActions } from '../../store/option-modal-slice';
import { postTimelineActions, postActions, postSuggestActions, postUserActions } from '../../store/post-timeline-slice';
import { getAvatarSrc } from '../../utils/CommonFunction';
import { confirmActions } from '../../store/confirm-modal-slice';
import { callFollow } from '../../store/profile-actions';
import ProfileAvatar from '../Common/ProfileAvatar';
const postAction = postActions;
const postTimelineAction = postTimelineActions;
const postSuggestAction = postSuggestActions;
const postUserAction = postUserActions;

const PostHeader = ({ post, isTimeline, type }) => {
    const dispatch = useDispatch();
    const actions = eval(type + 'Action');
    const user = useSelector(state => state.auth.user);
    const handleClickThreeDot = e => {
        if (post.profile_info.username === user.username) {
            dispatch(optionActions.setName('post-my'));
            dispatch(optionActions.setProps({
                type: type,
                post: post
            }));
        } else if (post.profile_info.is_follow) {
            dispatch(optionActions.setName('post-other'));
            dispatch(optionActions.setProps({
                type: type,
                post: post
            }))
        }
    }
    const handleFollow = e => {
        dispatch(callFollow({
            username: post.profile_info.username,
            props: { postCode: post.code },
            updateFn: actions.setFollowData
        }));
    };

    const handleUnfollow = e => {
        dispatch(confirmActions.setProps({
            titleAvatar: getAvatarSrc(post.profile_info, 'large'),
            titleDesc: `Unfollow @${post.profile_info.username}?`,
            text: 'Unfollow',
            handleProps: {
                type: type,
                username: post.profile_info.username,
                props: { postCode: post.code }
            }
        }));
        dispatch(confirmActions.setName('unfollow'));
    }
    return (
        <>
            <div className={`${isTimeline ? 'post-header' : 'post-header-main'}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ProfileAvatar profile={post.profile_info} isFix={false} detail='' avatarSize='small' margin={isTimeline ? '0.5rem' : '1rem'} />
                    {
                        !post.profile_info.is_follow && post.profile_info.username != user.username &&
                        <div>
                            <span style={{ marginLeft: '0.5rem' }}>•</span>
                            <span className='bold-text-small pointer-cursor'
                                style={{ marginLeft: '0.5rem', color: 'dodgerblue' }}
                                onClick={handleFollow}
                            >Follow</span>
                        </div>
                    }
                    {
                        !isTimeline && post.profile_info.is_follow && post.profile_info.username != user.username &&
                        <div>
                            <span style={{ marginLeft: '0.5rem' }}>•</span>
                            <span className='bold-text-small pointer-cursor'
                                style={{ marginLeft: '0.5rem' }}
                                onClick={handleUnfollow}
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