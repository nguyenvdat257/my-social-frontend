import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { AiFillHeart } from 'react-icons/ai'
import { getAvatarSrc } from '../../utils/CommonFunction';
import ProfilePreview from '../Profile/ProfilePreview';

const ProfileAvatar = ({ profile, avatarSize, isShowDetail, detail=profile.name, margin, isEnableHover=true }) => {
    const user = useSelector(state => state.auth.user);
    const isMy = user.username === profile.username;
    const stories = useSelector(state => state.storyBoard.myStories);
    // const detailText = detail ? detail : profile.name;
    const [showProfileLite, setShowProfileLite] = useState(false);
    const navigate = useNavigate();
    const handleClickAvatar = e => {
        // if (!profile.is_has_story)
        //     navigate(`/profiles/${profile.username}`);

        if (stories.length > 0 && isMy) {
            navigate('/stories/my');
        }
        else {
            navigate(`/profiles/${profile.username}`);
        }
    };
    const handleMouseOver = e => {
        setShowProfileLite(true);
    };
    const handleMouseOut = e => {
        setShowProfileLite(false);
    };
    const handleClickDetail = e => {
        navigate(`/profiles/${profile.username}`);
    };
    return (
        <>
            <div style={{position: 'relative', display: 'flex', alignItems: 'center' }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                <div style={{ position: 'relative' }}>
                    <img className={`avatar ${'avatar-' + avatarSize} pointer-cursor ${profile.is_has_story ?
                        (profile.is_story_seen ? 'story-board-outline' : 'story-board-outline-unseen') : ''}`}
                        src={getAvatarSrc(profile, avatarSize === 'large' || avatarSize === 'larger' ? 'large' : 'small')}
                        onClick={handleClickAvatar} />
                    {profile.is_like_story &&
                        <div style={{ position: 'absolute', bottom: '0%', right: '0%' }}>
                            <AiFillHeart size={15} style={{ color: 'red' }} />
                        </div>
                    }
                </div>
                {isShowDetail &&
                    <div style={{ marginLeft: margin }} onClick={handleClickDetail}>
                        <div className={'bold-text-small pointer-cursor'} >{profile.username}</div>
                        <div className={'fade-text-medium pointer-cursor'}>{detail}</div>
                    </div>
                }
                {showProfileLite && isEnableHover &&
                    <ProfilePreview username={profile.username} />
                }
            </div>
        </>
    )
}

export default ProfileAvatar