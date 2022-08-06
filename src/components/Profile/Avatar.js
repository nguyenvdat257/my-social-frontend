import React from 'react'
import { getAvatarSrc } from '../../utils/CommonFunction';

const Avatar = (profile) => {
    return (
        <img src={myConfig.hostName + getAvatarSrc(profile, 'large')} alt="Avatar"
            className={className} onClick={onClick}></img>
    )
}

export default Avatar