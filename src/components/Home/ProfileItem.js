import React from 'react';
import { useDispatch } from 'react-redux';
import { getAvatarSrc } from '../../utils/CommonFunction';
import { callFollow } from '../../store/profile-actions';
import { unfollowModal } from '../../utils/CommonFunction';
import { profileSuggestActions } from '../../store/profile-suggest-slice';



const ProfileItem = ({ profile }) => {
    const dispatch = useDispatch()
    const handleClickFollow = e => {
        dispatch(callFollow({ username: profile.username, updateFn: profileSuggestActions.setFollowData }));
    };
    const handleClickUnfollow = e => {
        unfollowModal(profile, dispatch);
    };
    return (
        <div className='modal-item'>
            <div style={{ display: 'flex' }}>
                <img className='avatar avatar-medium' src={getAvatarSrc(profile, 'small')} />
                <div className='name-avatar-margin-small'>
                    <div className='bold-text-small'>{profile.username}</div>
                    <div className='fade-text-small'>{`Followed by ${profile.followed_by}`}</div>
                </div>
            </div>
            {!profile.is_follow &&
                <div>
                    <div className='pointer-cursor bold-text-small' style={{ color: 'dodgerblue' }} onClick={handleClickFollow}>
                        Follow
                    </div>
                </div>}
            {profile.is_follow &&
                <div>
                    <div className='pointer-cursor bold-text-small' onClick={handleClickUnfollow}>
                        Following
                    </div>
                </div>}
        </div>
    )
}

export default ProfileItem