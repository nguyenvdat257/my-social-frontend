import { Button, Spinner } from 'react-bootstrap';
import React from 'react';
import { myConfig } from '../../config';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { callFollow } from '../../store/profile-actions';
import { profileModalActions } from '../../store/profile-modal-slice';



const ProfileListItem = ({ profile }) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const [gettingData, setGettingData] = useState(false);
    const handleClickFollow = e => {
        dispatch(callFollow(profile.username, setGettingData, profileModalActions.setFollowData))
    };
    return (
        <div className='modal-item'>
            <div style={{ display: 'flex' }}>
                <img className='avatar modal-avatar' src={profile.avatar.thumbnail ? myConfig.hostName + profile.avatar.thumbnail : myConfig.defaultAvatar} />
                <div>
                    <div className='modal-username'>{profile.username}</div>
                    <div className='modal-name fade-text'>{profile.name}</div>
                </div>
            </div>
            {profile.is_follow &&
                <div>
                    <Button className='btn btn-primary btn-block modal-item-button' onClick={handleClickFollow}>
                        {gettingData ?
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <div>Unfollow</div>}
                    </Button>
                </div>}
            {(!profile.is_follow && profile.username !== user.username) &&
                <div>
                    <Button className='btn btn-primary btn-block modal-item-button' onClick={handleClickFollow}>
                        {gettingData ?
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <div>Follow</div>}
                    </Button>
                </div>}
        </div>
    )
}

export default ProfileListItem