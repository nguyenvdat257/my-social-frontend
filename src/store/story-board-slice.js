import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';

const storyBoardSlice = createSlice({
    name: 'storyBoard',
    initialState: {
        unSeenProfiles: [],
        seenProfiles: [],
        profilesStoriesList: [],
        myStories: [],
        isMyStorySeen: true,
        gettingData: true,
        isDataFetched: false,
    },
    reducers: {
        setData(state, action) {
            const seenProfilesStories = action.payload.following_stories.filter(item => {
                return item[1].filter(story => story['is_seen'] === true).length > 0;
            });
            const unSeenProfilesStories = action.payload.following_stories.filter(item => {
                return item[1].filter(story => story['is_seen'] === true).length === 0;
            });

            state.seenProfiles = seenProfilesStories.map(item => item[1][0]['profile_info']);
            state.unSeenProfiles = unSeenProfilesStories.map(item => item[1][0]['profile_info']);
            state.profilesStoriesList = unSeenProfilesStories.concat(seenProfilesStories);
            state.profilesStoriesList = state.profilesStoriesList.map(item => [item[1][0]['profile_info'], item[1]]);
            state.myStories = action.payload.self_stories;
            if (state.myStories[0][1].length > 0) {
                state.myStories = state.myStories.map(item => [item[1][0]['profile_info'], item[1]]);
                state.isMyStorySeen = state.myStories.filter(item => {
                    return item[1].filter(story => story['is_seen'] === true).length > 0;
                }).length > 0;
            }
            state.isDataFetched = true;
        },
        setGettingData(state, action) {
            state.gettingData = action.payload;
        }
    }
})


export const storyBoardActions = storyBoardSlice.actions;

export const getData = () => {
    const url = myConfig.hostName + '/stories/current-user/';
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => storyBoardActions.setData(data);

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = () => storyBoardActions.setGettingData(false);
    const afterUnconnected = () => storyBoardActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export default storyBoardSlice;