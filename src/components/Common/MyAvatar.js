import React from 'react'
import { useSelector } from 'react-redux'
import { myConfig } from '../../config';

const MyAvatar = ({ className, onClick, isSmall }) => {
    const avatarSrc = useSelector(state => isSmall ? state.auth.user.avatar.thumbnail :
        state.auth.user.avatar.thumbnail_larger);
    return (
        <img src={myConfig.hostName + avatarSrc} alt="Avatar"
            className={className} onClick={onClick}></img>
    )
}

export default MyAvatar