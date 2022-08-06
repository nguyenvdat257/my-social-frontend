import React from 'react'
import ProfilePostItem from './ProfilePostItem'

const ProfilePosts = ({ posts }) => {
    return (
        <>
            <div className='post-grid center-item' style={{width: '70rem'}}>
                {
                    posts.map((post, index) => (
                        <ProfilePostItem key={index} post={post} />
                    ))
                }
            </div>
        </>
    )
}

export default ProfilePosts