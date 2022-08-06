import React, { useState } from 'react'
import MySpinner from '../Common/Spinner'
import PostComment from './PostComment'
import { useSelector, useDispatch } from 'react-redux'
import { postTimelineActions } from '../../store/post-timeline-slice'

const PostComments = ({ post, isTimeline, inputRef, type }) => {
  const dispatch = useDispatch();
  const gettingComment = useSelector(state => state[type].gettingComment);
  const commentLoaded = useSelector(state => state[type].commentLoaded);
  const handleClickViewComment = e => {
    if (type === 'postTimeline') {
      dispatch(postTimelineActions.setShowPostMain({ postCode: post.code, value: true }));

    } else {
      console.log('TODO');
    }
  };
  return (
    <>
      {// N comment
        isTimeline && post.comments_count > 2 &&
        <div className='post-row fade-text-medium pointer-cursor' onClick={handleClickViewComment}>
          {`View ${post.comments_count > 1 ? 'all ' : ''} ${post.comments_count} ${post.comments_count > 1 ? 'comments' : 'comment'}`}
        </div>
      }
      {// Display comments timeline
        isTimeline &&
        <div className='post-row post-content'>
          {
            post.comments.slice(0, 2).map((comment, index) => (
              <PostComment key={index} post={post} comment={comment} isTimeline={isTimeline} type={type}/>
            ))
          }
        </div>
      }
      {// Display comments main
        !isTimeline && commentLoaded &&
        <div className='post-row-main post-content' >
          <PostComment key={'body'} post={post} isTimeline={isTimeline} isOriginalComment={true} type={type}/>
          {
            post.comments.map((comment, index) => (
              <PostComment key={index} post={post} comment={comment} isTimeline={isTimeline} inputRef={inputRef} type={type}/>
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