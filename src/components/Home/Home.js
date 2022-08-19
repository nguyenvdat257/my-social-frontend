import React, { useRef } from 'react'
import PostTimelineList from '../Post/PostTimelineList'
import StoryBoard from '../Story/StoryBoard'
import { callGetNextData, postTimelineActions } from '../../store/post-timeline-slice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { callGetSuggestProfile } from '../../store/profile-suggest-slice'
import SuggestedProfileList from './SuggestedProfileList'
import ProfileAvatar from '../Common/ProfileAvatar'
import { headerActions } from '../../store/header-slice'
import { myConfig } from '../../config'

const Home = React.memo(() => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
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
          dispatch(callGetNextData('postTimeline', nextUrl));
        }
      }
    }
  };
  useEffect(() => {
    dispatch(headerActions.setPage('home'))
    dispatch(callGetSuggestProfile());
    document.title = myConfig.appName;
    // return () => dispatch(postTimelineActions.resetState());
  }, [])
  return (
    <>
      <div ref={postListRef} onScroll={onScroll} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5.5rem', height: '100%', overflowY: 'auto' }}>
        <div style={{ height: '100%', width: '30rem', padding: 0 }} >
          <StoryBoard key='story' />
          <PostTimelineList />
        </div>
        <div style={{ marginLeft: '2rem', marginTop: '1rem', height: '100%', width: '20rem' }}>
          <ProfileAvatar profile={user} avatarSize='large' isShowDetail={true} margin='1rem' />
          <SuggestedProfileList profileSuggests={profileSuggests} profileSuggestLoaded={profileSuggestLoaded} />
        </div>
      </div>
    </>
  )
})

export default Home