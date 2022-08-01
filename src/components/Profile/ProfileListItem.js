import { Button, Spinner } from 'react-bootstrap';
import React from 'react';
import { myConfig } from '../../config';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { callFollow } from '../../store/profile-actions';
import { profileModalActions } from '../../store/profile-modal-slice';
import { AiFillHeart } from 'react-icons/ai'



const ProfileListItem = ({ profile }) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const [gettingData, setGettingData] = useState(false);
    const handleClickFollow = e => {
        dispatch(callFollow({
            username: profile.username,
            updateFn: profileModalActions.setFollowData,
            setGettingData: setGettingData
        }))
    };
    return (
        <div className='modal-item'>
            <div style={{ display: 'flex' }}>
                <div style={{ position: 'relative' }}>
                    <img className='avatar avatar-medium' src={profile.avatar.thumbnail ? myConfig.hostName + profile.avatar.thumbnail : myConfig.defaultAvatar} />
                    {profile.is_like_story &&
                        <div style={{ position:'absolute', bottom: '0%', right: '0%' }}>
                            <AiFillHeart size={15} style={{color: 'red'}}/>
                        </div>
                    }
                </div>
                <div className='name-avatar-margin-small'>
                    <div className='bold-text-small'>{profile.username}</div>
                    <div className='fade-text-medium'>{profile.name}</div>
                </div>
            </div>
            {profile.is_follow &&
                <div>
                    <Button className='btn btn-primary btn-block modal-item-button' onClick={handleClickFollow}>
                        {gettingData ?
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <div className='bold-text-small'>Unfollow</div>}
                    </Button>
                </div>}
            {(!profile.is_follow && profile.username !== user.username) &&
                <div>
                    <Button className='btn btn-primary btn-block modal-item-button' onClick={handleClickFollow}>
                        {gettingData ?
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <div className='bold-text-small'>Follow</div>}
                    </Button>
                </div>}
        </div>
    )
}

export default ProfileListItem