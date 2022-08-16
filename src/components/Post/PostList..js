import React from 'react'
import PostListItem from './PostListItem'

const PostList = ({ posts, type, isClickOpenModal=true }) => {
    return (
        <>
            <div className='post-grid center-item' style={{width: '70rem'}}>
                {
                    posts.map((post, index) => (
                        <PostListItem key={index} post={post} type={type} isClickOpenModal={isClickOpenModal} />
                    ))
                }
            </div>
        </>
    )
}

export default PostList