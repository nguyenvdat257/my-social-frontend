import React from 'react'
import { useNavigate } from 'react-router-dom';
import { myConfig } from '../../config';

const TagAvatar = ({ tag, avatarSize, margin }) => {
    const navigate = useNavigate();
    const handleClickAvatar = e => {
        navigate(`/tags/${tag.body}`);
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img className={`avatar ${'avatar-' + avatarSize} pointer-cursor`}
                src={myConfig.defaultHashtag}/>
            <div style={{ marginLeft: margin }}>
                <div className={'bold-text-small pointer-cursor'} onClick={handleClickAvatar}>{tag.body}</div>
                <div className={'fade-text-medium'}>{`${tag.post_count} ${tag.post_count > 1 ? 'posts' : 'post'}`}</div>
            </div>
        </div>
    )
}

export default TagAvatar