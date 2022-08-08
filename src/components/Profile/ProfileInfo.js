import React, { useState, useEffect } from 'react'
import { RiUserFollowFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { callFollow, callGetFollower, callGetFollowing } from '../../store/profile-actions'
import { unfollowModal } from '../../utils/CommonFunction'
import ProfileListModal from './ProfileListModal'
import { profileActions } from '../../store/profile-slice'

const ProfileInfo = ({ profile }) => {
    const dispatch = useDispatch()
    const [showFollower, setShowFollower] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const handleShowFollower = e => {
        if (profile.num_followers > 0)
            setShowFollower(true);
    };
    const handleShowFollowing = e => {
        if (profile.num_followings > 0)
            setShowFollowing(true);
    }
    const handleClickFollow = e => {
        dispatch(callFollow({ username: profile.username, updateFn: profileActions.setFollowData }));
    };
    const handleClickUnfollow = e => {
        unfollowModal(profile, dispatch, 'profile');
    };
    useEffect(() => {
        setShowFollower(false);
        setShowFollowing(false);
    }, [profile])
    return (
        <>
            <div className='center-item-vertical' style={{ marginBottom: '2rem' }}>
                <div className='larger-text'>{profile.username}</div>
                <div className='bold-text-small my-button' style={{ marginLeft: '2rem', width: '4.7rem' }}>Message</div>
                {profile.is_follow &&
                    <div className='bold-text-small my-button pointer-cursor' style={{ marginLeft: '1rem', width: '4.7rem' }} onClick={handleClickUnfollow}>
                        <RiUserFollowFill size={18} />
                    </div>
                }
                {!profile.is_follow &&
                    <div className='bold-text-small my-button my-button-blue pointer-cursor' style={{ marginLeft: '1rem', width: '4.7rem' }} onClick={handleClickFollow}>
                        Follow
                    </div>
                }
            </div>
            <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
                <div>
                    <span className='bold-text-small'> {profile.num_posts} </span>
                    <span>{`${profile.num_posts > 1 ? 'posts' : 'post'}`}</span>
                </div>
                <div className={`${profile.num_followers > 0 ? 'pointer-cursor' : ''}`} style={{ marginLeft: '2rem' }} onClick={handleShowFollower}>
                    <span className='bold-text-small'> {profile.num_followers} </span>
                    <span>{`${profile.num_followers > 1 ? 'followers' : 'follower'}`}</span>
                </div>
                <div className={`${profile.num_followings > 0 ? 'pointer-cursor' : ''}`} style={{ marginLeft: '2rem' }} onClick={handleShowFollowing}>
                    <span className='bold-text-small'> {profile.num_followings} </span>
                    <span>following</span>
                </div>
            </div>
            {profile.name &&
                <div className='bold-text-medium' >{profile.name}</div>
            }
            {profile.bio &&
                <div className='profile-bio'>{profile.bio}</div>
            }
            {showFollower &&
                <ProfileListModal title='Followers' showModal={showFollower} setShowModal={setShowFollower}
                    getData={callGetFollower(profile.username)} />}
            {showFollowing &&
                <ProfileListModal title='Followings' showModal={showFollowing} setShowModal={setShowFollowing}
                    getData={callGetFollowing(profile.username)} />}

        </>
    )
}

export default ProfileInfo