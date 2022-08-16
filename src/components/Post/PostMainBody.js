import React from 'react'
import PostMainSlide from './PostMainSlide'
import PostMainInfo from './PostMainInfo'

const PostMainBody = ({post, type}) => {
    return (
        <div style={{ display: 'flex', height: '100%', alignItems: 'center', backgroundColor: 'black' }}>
            <div className='post-main-slide'>
                <PostMainSlide post={post} />
            </div>
            <PostMainInfo post={post} type={type} />
        </div>
    )
}

export default PostMainBody