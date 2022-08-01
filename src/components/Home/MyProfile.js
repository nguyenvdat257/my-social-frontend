import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import MyAvatar from '../Common/MyAvatar';

const MyProfile = () => {
    const user = useSelector(state => state.auth.user);
    const stories = useSelector(state => state.storyBoard.myStories);
    const isMyStorySeen = useSelector(state => state.storyBoard.isMyStorySeen);
    const navigate = useNavigate();
    const handleClickAvatar = e => {
        if (stories.length > 0) {
            navigate('/stories/my/');
        }
        else {
            navigate('/profile');
        }
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <MyAvatar className={`avatar avatar-large pointer-cursor ${!isMyStorySeen ? ' story-board-outline-unseen' : ''}`}
                onClick={handleClickAvatar} isSmall={false} />
            <div style={{ marginLeft: '0.5rem' }}>
                <div className={'bold-text-small'}>{user.username}</div>
                <div className={'fade-text-medium'}>{user.name}</div>
            </div>
        </div>
    )
}

export default MyProfile