import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { myConfig } from '../../config';
import { callGetPostByTag } from '../../store/posttag-action';
import MySpinner from '../Common/Spinner';
import PostList from '../Post/PostList.';
import { postActions } from '../../store/post-timeline-slice';
import { callGetNextData } from '../../store/post-timeline-slice';

const PostTag = () => {
  const dispatch = useDispatch();
  const { tag } = useParams();
  const posts = useSelector(state => state.post.posts);
  const postsLoaded = useSelector(state => state.post.postLoaded);
  const nextUrl = useSelector(state => state.post.nextUrl);
  const usedNextUrl = useSelector(state => state.post.usedNextUrl);
  const ref = useRef(null);
  const onScroll = e => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      console.log(scrollTop + clientHeight - scrollHeight);
      if (scrollTop + clientHeight - scrollHeight > -300) {
        if (nextUrl && !usedNextUrl.includes(nextUrl)) {
          dispatch(postActions.appendUsedNextUrl(nextUrl));
          dispatch(callGetNextData('post', nextUrl));
        }
      }
    }
  };
  useEffect(() => {
    document.title = myConfig.appName;
    postActions.resetState();
    dispatch(callGetPostByTag(tag));
  }, [tag]);
  useEffect(() => {
    console.log('fewiofi')
    return () => postActions.resetState();
  }, []);
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingTop: '5.5rem' }} ref={ref} onScroll={onScroll} >
      {!postsLoaded &&
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MySpinner />
        </div>
      }
      {postsLoaded && posts.length > 0 &&
        <div className='center-item'>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', marginLeft: '5rem' }}>
              <img className='avatar avatar-larger' src={myConfig.mediaHost + posts[0].images[0].image.medium} />
              <div style={{ marginLeft: '2rem' }}>
                <div className='fade-text-larger'>
                  #{tag}
                </div>
                <div>
                  <span className='bold-text-small'>{posts.length}</span> posts
                </div>
              </div>
            </div>
            <div className='fade-text-medium bold-text' style={{ marginBottom: '1rem', marginLeft: '5rem' }}>
              Top Posts
            </div>
            <PostList posts={posts} type='post' />
          </div>
        </div>
      }
    </div>
  )
}

export default PostTag