import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import PostHeader from './PostHeader';
import PostDetail from './PostDetail';
import PostComments from './PostComments';
import { callGetComments, callGetNextComment } from '../../store/post-timeline-slice';

const PostMainInfo = ({ post }) => {
  const dispatch = useDispatch()
  const commentLoaded = useSelector(state => state.postTimeline.commentLoaded);
  const nextUrl = useSelector(state => state.postTimeline.nextCommentUrl)
  const commentListRef = useRef(null);
  const inputRef = useRef(null);
  const onScroll = () => {
    if (commentListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = commentListRef.current;
      if (scrollTop + clientHeight > scrollHeight - 1.5 && scrollTop + clientHeight < scrollHeight + 1.5) {
        if (nextUrl) {
          dispatch(callGetNextComment(post.code, nextUrl));
        }
      }
    }
  };
  useEffect(() => {
    dispatch(callGetComments(post.code));
  }, []);
  // get next comments if loaded but not fill all screen
  useEffect(() => {
    if (commentLoaded) {
      if (commentListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = commentListRef.current;
        if (scrollTop + clientHeight - scrollHeight === 0) {
          if (nextUrl) {
            dispatch(callGetNextComment(post.code, nextUrl));
          }
        }
      }
    }
  }, [commentLoaded]);
  return (
    <div style={{ height: '100%', width: '30rem', position: 'relative' }}>
      <PostHeader post={post} isTimeline={false} />
      <div className='post-comments' ref={commentListRef} onScroll={onScroll}>
        <PostComments post={post} isTimeline={false} inputRef={inputRef} />
      </div>
      <div className='post-detail-main'>
        <PostDetail post={post} isTimeline={false}
          inputRef={inputRef} commentListRef={commentListRef} />
      </div>
    </div>
  )
}

export default PostMainInfo