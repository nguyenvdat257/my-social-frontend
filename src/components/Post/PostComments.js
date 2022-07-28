import React, { useState } from 'react'
import MySpinner from '../Common/Spinner'
import PostComment from './PostComment'
import { useSelector, useDispatch } from 'react-redux'
import { postTimelineActions } from '../../store/post-timeline-slice'

const PostComments = ({ post, isTimeline, inputRef}) => {
  const dispatch = useDispatch();
  const gettingComment = useSelector(state => state.postTimeline.gettingComment);
  const commentLoaded = useSelector(state => state.postTimeline.commentLoaded);
  const handleClickViewComment = e => {
    dispatch(postTimelineActions.setShowPostMain({postCode: post.code, value: true}));
  };
  return (
    <>
      {// N comment
        isTimeline && post.comments_count > 2 &&
        <div className='post-row fade-text pointer-cursor' onClick={handleClickViewComment}>
          {`View ${post.comments_count > 1 ? 'all ' : ''} ${post.comments_count} ${post.comments_count > 1 ? 'comments' : 'comment'}`}
        </div>
      }
      {// Display comments timeline
        isTimeline &&
        <div className='post-row post-content'>
          {
            post.comments.slice(0, 2).map((comment, index) => (
              <PostComment key={index} post={post} comment={comment} isTimeline={isTimeline} />
            ))
          }
        </div>
      }
      {// Display comments main
        !isTimeline && commentLoaded &&
        <div className='post-row-main post-content' >
          <PostComment key={'body'} post={post} isTimeline={isTimeline} isOriginalComment={true}/>
          {
            post.comments.map((comment, index) => (
              <PostComment key={index} post={post} comment={comment} isTimeline={isTimeline} inputRef={inputRef} />
            ))
          }
        </div>
      }
      {!isTimeline && gettingComment &&
        <div style={{ position: 'relative' }}><MySpinner /></div>
      }
    </>
  )
}

export default PostComments