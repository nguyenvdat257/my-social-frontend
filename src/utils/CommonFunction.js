import { myConfig } from "../config"
import { confirmActions } from "../store/confirm-modal-slice"

export const getAvatarSrc = (profile, type) => {
    if (type === 'small') {
        return profile.avatar.thumbnail ? myConfig.mediaHost + profile.avatar.thumbnail : myConfig.defaultAvatar
    }
    else
        return profile.avatar.thumbnail_larger ? myConfig.mediaHost + profile.avatar.thumbnail_larger : myConfig.defaultAvatar
}

export const unfollowModal = (profile, dispatch, type) => {
    dispatch(confirmActions.setProps({
        titleAvatar: getAvatarSrc(profile, 'large'),
        titleDesc: `Unfollow @${profile.username}?`,
        text: 'Unfollow',
        handleProps: { username: profile.username, type: type},
        
    }));
    dispatch(confirmActions.setName('unfollow'));
}