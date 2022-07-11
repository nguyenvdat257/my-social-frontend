import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';

const storySlice = createSlice({
    name: 'privacy',
    initialState: {
        isLike: true,
        profile: {},
        story: {}
    },
    reducers: {
        setProfiles(state, action) {
            const seenProfilesStories = action.payload.following_stories.filter(item => {
                return item[1].filter(story => story['is_seen'] === true).length > 0;
            });
            const unSeenProfilesStories = action.payload.following_stories.filter(item => {
                return item[1].filter(story => story['is_seen'] === true).length === 0;
            });

            state.seenProfiles = seenProfilesStories.map(item => item[1][0]['profile_info']);
            state.unSeenProfiles = unSeenProfilesStories.map(item => item[1][0]['profile_info']);
            for (const profile of state.unSeenProfiles.concat(state.seenProfiles)) {
                profile.avatar = profile.avatar.thumbnail_larger ? myConfig.hostName + profile.avatar.thumbnail_larger : myConfig.defaultAvatar;
            }
            state.profilesStoriesList = unSeenProfilesStories.concat(seenProfilesStories);
            state.selfStories = action.payload.self_stories
        },
    }
})


export const storyBoardActions = storyBoardSlice.actions;

export const getData = () => {
    const url = myConfig.hostName + '/stories/current-user/';
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => storyBoardActions.setProfiles(data);

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = () => storyBoardActions.setGettingData(false);
    const afterUnconnected = () => storyBoardActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export default storyBoardSlice;