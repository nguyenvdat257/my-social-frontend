import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import PostHeader from './PostHeader';
import PostDetail from './PostDetail';
import PostComments from './PostComments';
import PostTimelineList from './PostTimelineList';
import { postTimelineActions, callGetComments, callGetNextComment, 
  postActions, postSuggestActions, postUserActions } from '../../store/post-timeline-slice';
const postAction = postActions;
const postTimelineAction = postTimelineActions;
const postSuggestAction = postSuggestActions;
const postUserAction = postUserActions;

const PostMainInfo = ({ post, type }) => {
  const dispatch = useDispatch()
  const actions = eval(type + 'Action');
  const commentLoaded = useSelector(state => state[type].commentLoaded);
  const nextUrl = useSelector(state => state[type].nextCommentUrl)
  const usedNextUrl = useSelector(state => state[type].usedNextCommentUrl)
  const commentListRef = useRef(null);
  const inputRef = useRef(null);
  const onScroll = () => {
    if (commentListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = commentListRef.current;
      if (scrollTop + clientHeight > scrollHeight - 1.5 && scrollTop + clientHeight < scrollHeight + 1.5) {
        if (nextUrl && !usedNextUrl.includes(nextUrl)) {
          dispatch(actions.appendUsedNextCommentUrl(nextUrl));
          dispatch(callGetNextComment(type, post.code, nextUrl));
        }
      }
    }
  };
  useEffect(() => {
    dispatch(callGetComments(type, post.code));
  }, [post.code]);
  // get next comments if loaded but not fill all screen
  useEffect(() => {
    if (commentLoaded) {
      if (commentListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = commentListRef.current;
        if (scrollTop + clientHeight - scrollHeight === 0) {
          if (nextUrl) {
            dispatch(callGetNextComment(type, post.code, nextUrl));
          }
        }
      }
    }
  }, [commentLoaded]);
  return (
    <div style={{ height: '100%', width: '30rem', position: 'relative', backgroundColor: 'white' }}>
      <PostHeader post={post} isTimeline={false} type={type} />
      <div className='post-comments' ref={commentListRef} onScroll={onScroll}>
        <PostComments post={post} isTimeline={false} inputRef={inputRef} type={type} />
      </div>
      <div className='post-detail-main'>
        <PostDetail post={post} isTimeline={false}
          inputRef={inputRef} commentListRef={commentListRef} type={type} />
      </div>
    </div>
  )
}

export default PostMainInfo