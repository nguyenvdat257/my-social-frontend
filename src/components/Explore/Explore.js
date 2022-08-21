import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { myConfig } from '../../config';
import { headerActions } from '../../store/header-slice';
import { callGetPostSuggest } from '../../store/post-suggest-slice';
import { callGetNextData, postSuggestActions } from '../../store/post-timeline-slice';
import MySpinner from '../Common/Spinner';
import PostList from '../Post/PostList.';

const Explore = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.postSuggest.posts);
  const postsLoaded = useSelector(state => state.postSuggest.postLoaded);
  const nextUrl = useSelector(state => state.postSuggest.nextUrl);
  const usedNextUrl = useSelector(state => state.postSuggest.usedNextUrl);
  const ref = useRef(null);
  const onScroll = e => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      console.log(scrollTop + clientHeight - scrollHeight);
      if (scrollTop + clientHeight - scrollHeight > -300) {
        if (nextUrl && !usedNextUrl.includes(nextUrl)) {
          dispatch(postSuggestActions.appendUsedNextUrl(nextUrl));
          dispatch(callGetNextData('postSuggest', nextUrl));
        }
      }
    }
  };
  useEffect(() => {
    dispatch(headerActions.setPage('explore'));
    // dispatch(postSuggestActions.resetState());
    document.title = myConfig.appName;
    if (!postsLoaded) {
      dispatch(callGetPostSuggest());
    }
  }, []);
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingTop: '5.5rem' }} ref={ref} onScroll={onScroll} >
      {!postsLoaded &&
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MySpinner />
        </div>
      }
      {postsLoaded &&
        <div className='center-item'>
          <PostList posts={posts} type='postSuggest' />
        </div>
      }
    </div>
  )
}

export default Explore