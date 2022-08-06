import React, { useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { callGetPostsLite, callGetProfileLite } from '../../store/profile-lite-slice';
import ProfileAvatar from '../Common/ProfileAvatar';
import { useSelector, useDispatch } from 'react-redux';
import MySpinner from '../Common/Spinner';
import { myConfig } from '../../config';

const ProfilePreview = ({ username }) => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profileLite.profile);
    const posts = useSelector(state => state.profileLite.posts);
    const profileLoaded = useSelector(state => state.profileLite.profileLoaded);
    const postsLoaded = useSelector(state => state.profileLite.postsLoaded);
    useEffect(() => {
        dispatch(callGetProfileLite(username));
        dispatch(callGetPostsLite(username));
    }, [])
    return (
        <div style={{ position: 'absolute', left: '-2.5rem', top: '3rem', zIndex: 99 }}>
            <Card style={{ position: 'relative', width: '24rem', height: 'fit-content' }}>
                {!profileLoaded || !postsLoaded &&
                    <MySpinner />
                }
                {profileLoaded && postsLoaded &&
                    <>
                        <div className='border-bottom' style={{ padding: '1rem' }}>
                            <ProfileAvatar profile={profile} avatarSize='large' isShowDetail={true} margin='1rem' isEnableHover={false} />
                        </div>

                        <div className='center-item' style={{ display: 'flex',  padding: '1rem' }}>
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
                        <div style={{display:'flex'}}>
                            {
                                posts.map((post, index) => (
                                    <img style={{ width: '8rem', height: '8rem' }} src={post.image ? myConfig.hostName + post.image.image : myConfig.hostName + post.images[0].image} />
                                ))
                            }
                        </div>
                    </>
                }
            </Card>
        </div>
    )
}

export default ProfilePreview