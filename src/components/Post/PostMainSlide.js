import React from 'react'
import { Carousel } from 'react-bootstrap'
import { myConfig } from '../../config'

const PostMainSlide = ({ post }) => {
  return (
    <>
      {
        post.images.length === 1 &&
        <img style={{ maxWidth: '90%', maxHeight: '100%' }} src={myConfig.hostName + post.images[0].image} />
      }
      {
        post.images.length > 1 &&
        <Carousel interval={null} style={{ height: 'fit-content', background: 'black' }}>
          {
            post.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img className='post-image' src={myConfig.hostName + image.image}
                  style={{ minWidth: '25rem' }} />
              </Carousel.Item>
            ))
          }
        </Carousel>
      }
    </>
  )
}

export default PostMainSlide