import React, { useRef, useLayoutEffect } from 'react'
import PostTimelineList from '../Post/PostTimelineList'
import StoryBoard from '../Story/StoryBoard'
import { callGetNextData, postTimelineActions } from '../../store/post-timeline-slice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

const Home = React.memo(() => {
  const dispatch = useDispatch();
  const nextUrl = useSelector(state => state.postTimeline.nextUrl);
  const usedNextUrl = useSelector(state => state.postTimeline.usedNextUrl);
  const postListRef = useRef(null);
  const onScroll = () => {
    if (postListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = postListRef.current;
      if (scrollTop + clientHeight - scrollHeight > -600  ) {
        if (nextUrl && !usedNextUrl.includes(nextUrl)) {
          dispatch(postTimelineActions.appendUsedNextUrl(nextUrl));
          dispatch(callGetNextData(nextUrl));
        }
      }
    }
  };
  useEffect(() => {
    return () => dispatch(postTimelineActions.resetState());
  }, [])
  return (
    <>
      <div ref={postListRef} onScroll={onScroll} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5.5rem', height: '100%', overflowY: 'auto' }}>
        <div style={{ height: '100%', width: '30rem', padding: 0 }} >
          <StoryBoard key='story' />
          <PostTimelineList />
        </div>
      </div>
    </>
  )
})

export default Home