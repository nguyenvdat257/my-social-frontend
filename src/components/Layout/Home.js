import React from 'react'
import PostTimelineList from '../Post/PostTimelineList'
import StoryBoard from '../Story/StoryBoard'

const Home = () => {
  return (
    <>
      <div className="row mb-0" style={{ 'paddingTop': '5.5rem', 'height': '100%' }}>
        <div className="col-4 offset-2" style={{ height: '100%', padding: 0 }} >
          <StoryBoard />
          <PostTimelineList />
        </div>
      </div>
    </>
  )
}

export default Home