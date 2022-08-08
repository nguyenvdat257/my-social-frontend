import React from 'react'
import PostListItem from './PostListItem'

const PostList = ({ posts, type }) => {
    return (
        <>
            <div className='post-grid center-item' style={{width: '70rem'}}>
                {
                    posts.map((post, index) => (
                        <PostListItem key={index} post={post} type={type} />
                    ))
                }
            </div>
        </>
    )
}

export default PostList