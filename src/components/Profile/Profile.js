import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { callGetPosts, callGetProfile } from '../../store/profile-slice'
import ProfileInfo from './ProfileInfo'
import { useParams, useNavigate } from 'react-router-dom'
import ProfileAvatar from '../Common/ProfileAvatar'
import { GrGrid } from 'react-icons/gr'
import { BsBookmark } from 'react-icons/bs'
import { postActions } from '../../store/post-timeline-slice'
import { callGetNextData } from '../../store/post-timeline-slice'
import PostList from '../Post/PostList.'

const Profile = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const profile = useSelector(state => state.profile.profile);
  const posts = useSelector(state => state.post.posts);
  const profileLoaded = useSelector(state => state.profile.profileLoaded);
  const postsLoaded = useSelector(state => state.post.postLoaded);
  const nextUrl = useSelector(state => state.post.nextUrl);
  const usedNextUrl = useSelector(state => state.post.usedNextUrl);
  const ref = useRef(null);
  const onScroll = e => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      if (scrollTop + clientHeight - scrollHeight > -300) {
        if (nextUrl && !usedNextUrl.includes(nextUrl)) {
          dispatch(postActions.appendUsedNextUrl(nextUrl));
          dispatch(callGetNextData('post', nextUrl));
        }
      }
    }
  };
  useEffect(() => {
    dispatch(callGetProfile(username));
    dispatch(callGetPosts(username));
  }, [username]);
  return (
    <>
      {profileLoaded &&
        <>
          <div style={{height: '100%', overflowY: 'auto'}}  ref={ref} onScroll={onScroll} >
            <div className='main-container'>
              <div className='center-item' style={{ width: '20rem', 'paddingBottom': '3rem', borderBottom: '2px ridge' }}>
                <ProfileAvatar profile={profile} avatarSize='larger' isShowDetail={false} />
              </div>
              <div style={{ width: '40rem', 'paddingBottom': '3rem', borderBottom: '2px ridge' }}>
                <ProfileInfo profile={profile} />
              </div>
            </div>

            <div className='center-item-horizontal'>
              <div className='center-item profile-option-selected'>
                <div className='center-item'><GrGrid size={12} /></div>
                <div style={{ marginLeft: '0.5rem' }}>POSTS</div>
              </div>
              <div className='center-item profile-option-not-selected' style={{ marginLeft: '2rem' }}>
                <div className='center-item'><BsBookmark size={12} /></div>
                <div style={{ marginLeft: '0.5rem' }}>SAVED</div>
              </div>
            </div>

            {postsLoaded &&
              <div className='center-item' style={{ marginTop: '1rem' }}>
                <PostList posts={posts} type='post' />
              </div>
            }

          </div>
        </>
      }
    </>
  )
}

export default Profile