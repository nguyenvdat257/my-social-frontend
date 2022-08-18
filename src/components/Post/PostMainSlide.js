import React from 'react'
import { Carousel } from 'react-bootstrap'
import { myConfig } from '../../config'

const PostMainSlide = ({ post }) => {
  return (
    <>
      {
        post.images.length === 1 &&
        <img style={{ width: '40rem', height: '40rem'}} src={myConfig.mediaHost + post.images[0].image} />
      }
      {
        post.images.length > 1 &&
        <Carousel interval={null} style={{ height: 'fit-content', background: 'black' }}>
          {
            post.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img className='post-image' src={myConfig.mediaHost + image.image}
                  style={{ width: '40rem', height: '40rem' }} />
              </Carousel.Item>
            ))
          }
        </Carousel>
      }
    </>
  )
}

export default PostMainSlide