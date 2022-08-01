import React, { useRef } from 'react'
import PostTimelineList from '../Post/PostTimelineList'
import StoryBoard from '../Story/StoryBoard'
import { callGetNextData, postTimelineActions } from '../../store/post-timeline-slice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import MyProfile from './MyProfile'
import { callGetSuggestProfile } from '../../store/profile-suggest-slice'
import ProfileItem from './ProfileItem'

const Home = React.memo(() => {
  const dispatch = useDispatch();
  const nextUrl = useSelector(state => state.postTimeline.nextUrl);
  const usedNextUrl = useSelector(state => state.postTimeline.usedNextUrl);
  const profileSuggestLoaded = useSelector(state => state.profileSuggest.profileSuggestLoaded);
  const profileSuggests = useSelector(state => state.profileSuggest.profiles);

  const postListRef = useRef(null);
  const onScroll = () => {
    if (postListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = postListRef.current;
      if (scrollTop + clientHeight - scrollHeight > -600) {
        if (nextUrl && !usedNextUrl.includes(nextUrl)) {
          dispatch(postTimelineActions.appendUsedNextUrl(nextUrl));
          dispatch(callGetNextData(nextUrl));
        }
      }
    }
  };
  useEffect(() => {
    dispatch(callGetSuggestProfile());
    return () => dispatch(postTimelineActions.resetState());
  }, [])
  return (
    <>
      <div ref={postListRef} onScroll={onScroll} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5.5rem', height: '100%', overflowY: 'auto' }}>
        <div style={{ height: '100%', width: '30rem', padding: 0 }} >
          <StoryBoard key='story' />
          <PostTimelineList />
        </div>
        <div style={{ marginLeft: '2rem', marginTop: '1rem', height: '100%', width: '20rem' }}>
          <MyProfile />
          <div className='fade-text-medium bold-text' style={{ marginTop: '1rem' }}>Suggestions For You</div>
          <div style={{ marginTop: '1rem', paddingRight: '1rem' }}>
            {profileSuggestLoaded &&
              profileSuggests.slice(0, 5).map((profile, index) => (
                <ProfileItem key={index} profile={profile} />
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
})

export default Home