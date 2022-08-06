import React from 'react';
import { useDispatch } from 'react-redux';
import { callFollow } from '../../store/profile-actions';
import { unfollowModal } from '../../utils/CommonFunction';
import { profileSuggestActions } from '../../store/profile-suggest-slice';
import { useNavigate } from 'react-router-dom'
import ProfileAvatar from '../Common/ProfileAvatar';



const ProfileItem = ({ profile }) => {
    const dispatch = useDispatch();
    const handleClickFollow = e => {
        dispatch(callFollow({ username: profile.username, updateFn: profileSuggestActions.setFollowData }));
    };
    const handleClickUnfollow = e => {
        unfollowModal(profile, dispatch, 'unfollow');
    };
    return (
        <div className='modal-item'>
            <ProfileAvatar profile={profile} avatarSize='medium' isShowDetail={true}
                detail={`Followed by ${profile.followed_by}`} margin='0.5rem' />
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