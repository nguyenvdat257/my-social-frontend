import React, { useState, useRef } from 'react'
import { Card } from 'react-bootstrap'
import { myConfig } from '../../config';
import Carousel from 'react-bootstrap/Carousel';
import PostHeader from './PostHeader';
import PostDetail from './PostDetail';
import PostMain from './PostMain';
import { useSelector } from 'react-redux';

const PostTimeline = React.memo((params) => {
  const post = params.post;
  const showPostMain = useSelector(state => state.postTimeline.postProps[post.code].showPostMain);
  const inputRef = useRef(null);
  return (
    <Card className='post-timeline-card' style={{ backgroundColor: 'white', borderRadius: '0.5rem' }}>
      <PostHeader post={post} isTimeline={true} />
      {
        post.images.length === 1 &&
        <img className='post-image' src={myConfig.hostName + post.images[0].image}
          style={{ width: '30rem', height: '30rem' }} />
      }
      {
        post.images.length > 1 &&
        <Carousel interval={null}>
          {
            post.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img className='post-image' src={myConfig.hostName + image.image}
                  style={{ width: '30rem', height: '30rem' }} />
              </Carousel.Item>
            ))
          }
        </Carousel>
      }
      <PostDetail post={post} isTimeline={true} inputRef={inputRef} />
      {showPostMain &&
        < PostMain post={post} />}
    </Card>
  )
})

export default PostTimeline