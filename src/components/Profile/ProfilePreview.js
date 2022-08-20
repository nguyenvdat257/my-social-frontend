import React, { useEffect, useState, useRef } from 'react'
import { Card, Button } from 'react-bootstrap'
import { callGetPostsPreview, callGetProfilePreview, profilePreviewActions } from '../../store/profile-preview-slice';
import ProfileAvatar from '../Common/ProfileAvatar';
import { useSelector, useDispatch } from 'react-redux';
import MySpinner from '../Common/Spinner';
import { myConfig } from '../../config';
import { callFollow } from '../../store/profile-actions';
import { unfollowModal } from '../../utils/CommonFunction';
import { callCreateChatroom } from '../../store/chat-slice';
import { headerActions } from '../../store/header-slice';
import { useNavigate } from 'react-router-dom';

const ProfilePreview = ({ username, isFix = true }) => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profilePreview.profile);
    const user = useSelector(state => state.auth.user);
    const posts = useSelector(state => state.profilePreview.posts);
    const profileLoaded = useSelector(state => state.profilePreview.profileLoaded);
    const postsLoaded = useSelector(state => state.profilePreview.postsLoaded);
    const creatingChatroom = useSelector(state => state.chat.creatingChatroom);
    const prevCreatingChatroom = useRef(null);
    const [followSending, setFollowSending] = useState(false);
    const navigate = useNavigate();
    const handleClickFollow = e => {
        e.preventDefault();
        dispatch(callFollow({
            username: username,
            updateFn: profilePreviewActions.setFollowData,
            setGettingData: setFollowSending
        }));
    };
    const handleClickUnfollow = e => {
        e.preventDefault();
        unfollowModal(profile, dispatch, 'profilePreview');
    };
    const handleClickMessage = e => {
        dispatch(callCreateChatroom(JSON.stringify({ usernames: [user.username, username] })));
        // dispatch(chatActions.resetCreateChatroom());
    }
    useEffect(() => {
        dispatch(callGetProfilePreview(username));
        dispatch(callGetPostsPreview(username));
        return () => dispatch(profilePreviewActions.resetState());
    }, [])
    useEffect(() => {
        // trigger after creating chatroom
        if (prevCreatingChatroom.current === true && creatingChatroom === false) {
            dispatch(headerActions.setPage('chat'));
            navigate('/direct/inbox');
        }
        prevCreatingChatroom.current = creatingChatroom;
    }, [creatingChatroom])
    return (
        <div style={{ position: 'absolute', left: '-2.5rem', top: '2rem', zIndex: 999 }}>
            <div style={isFix ? { position: 'fixed' } : {}}>
                <Card style={{ position: 'relative', width: '24rem', height: '24rem' }}>
                    {(!profileLoaded || !postsLoaded) &&
                        <MySpinner />
                    }
                    {profileLoaded && postsLoaded &&
                        <>
                            <div className='border-bottom' style={{ padding: '1rem' }}>
                                <ProfileAvatar profile={profile} avatarSize='large' isShowDetail={true} margin='1rem' isEnableHover={false} />
                            </div>

                            <div className='center-item' style={{ display: 'flex', padding: '1rem' }}>
                                <div className='center-item-column'>
                                    <div className='bold-text-small'> {profile.num_posts} </div>
                                    <div className='fade-text-small'>{`${profile.num_posts > 1 ? 'posts' : 'post'}`}</div>
                                </div>
                                <div className='center-item-column' style={{ marginLeft: '4.5rem' }} >
                                    <div className='bold-text-small'> {profile.num_followers} </div>
                                    <div className='fade-text-small'>{`${profile.num_followers > 1 ? 'followers' : 'follower'}`}</div>
                                </div>
                                <div className='center-item-column' style={{ marginLeft: '4.5rem' }} >
                                    <div className='bold-text-small'> {profile.num_followings} </div>
                                    <div className='fade-text-small'>following</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                {
                                    posts.map((post, index) => {
                                        if (post.images.length > 0) {
                                            return <img key={index} style={{ width: '8rem', height: '8rem' }} src={myConfig.mediaHost + post.images[0].image} />
                                        }
                                    })
                                }
                            </div>
                            {!profile.is_follow &&
                                <div style={{ padding: '1rem' }}>
                                    <div className='my-button my-button-blue' style={{ position: 'relative', width: '100%' }} onClick={handleClickFollow}>
                                        {followSending && <MySpinner type='small' />}
                                        {!followSending && <div>Follow</div>}
                                    </div>
                                </div>
                            }
                            {profile.is_follow &&
                                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <div className='my-button' style={{ width: '45%' }} onClick={handleClickMessage}>
                                        {!creatingChatroom && <div>Message</div>}
                                        {creatingChatroom && <MySpinner type='small' />}
                                    </div>
                                    <div className='my-button' style={{ width: '50%' }} onClick={handleClickUnfollow}>Following</div>
                                </div>
                            }
                        </>
                    }
                </Card>

            </div>
        </div>
    )
}

export default ProfilePreview