import { Button, Spinner } from 'react-bootstrap';
import React from 'react';
import { myConfig } from '../../config';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { callFollow } from '../../store/profile-actions';
import { profileModalActions } from '../../store/profile-modal-slice';
import ProfileAvatar from '../Common/ProfileAvatar';



const ProfileListItem = ({ profile, setShowModal }) => {
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
            <ProfileAvatar profile={profile} avatarSize='medium' isShowDetail={true} margin='0.5rem' />
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