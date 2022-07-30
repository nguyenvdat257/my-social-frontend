import { myConfig } from "../config"

export const getAvatarSrc = (profile, type) => {
    if (type === 'small')
        return profile.avatar ? myConfig.hostName + profile.avatar.thumbnail : myConfig.defaultAvatar
    else
        return profile.avatar ? myConfig.hostName + profile.avatar.thumbnail_larger : myConfig.defaultAvatar
}