import React from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { myConfig } from '../../config';

const PostHeader = ({ post, isTimeline }) => {
    return (
        <div className={`${isTimeline ? 'post-header' : 'post-header-main'}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img className='avatar post-header-avatar' src={post.profile_info.avatar.thumbnail ? myConfig.hostName + post.profile_info.avatar.thumbnail : myConfig.defaultAvatar} />
                <div className={`${isTimeline ? 'post-header-username' : 'post-header-username-main'} post-username`}>
                    {post.profile_info.username}
                </div>
            </div>
            <div>
                <BsThreeDots />
            </div>
        </div>
    )
}

export default PostHeader