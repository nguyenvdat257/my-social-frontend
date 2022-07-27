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
        selfStories: [],
        progress: 0,
        isPause: false,
        profileIdx: 0,
        storyIdx: 0,
        isViewAll: false,
        isFirstStory: true,
        gettingData: true,
        isDataFetched: false,
        isDataReady: false
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
            state.selfStories = action.payload.self_stories;
            state.isDataFetched = true;
        },
        incrementStoryIdx(state, action) {
            if (state.storyIdx < state.profilesStoriesList[state.profileIdx][1].length - 1) {
                state.storyIdx += 1;
            } else if (state.profileIdx < state.profilesStoriesList.length - 1) {
                state.profileIdx += 1
                state.storyIdx = 0;
            } else {
                state.isViewAll = true;
            }
            state.isFirstStory = false;
        },
        decrementStoryIdx(state, action) {
            if (state.storyIdx > 0) {
                state.storyIdx -= 1;
            } else if (state.profileIdx > 0) {
                state.profileIdx -= 1;
                state.storyIdx = state.profilesStoriesList[state.profileIdx][1].length - 1;
            }
            if (state.profileIdx === 0 && state.storyIdx === 0)
                state.isFirstStory = true;
        },
        setIdx(state, action) {
            state.profileIdx = action.payload;
            state.storyIdx = 0;
            state.progress = 0
            if (state.profileIdx === 0 && state.storyIdx === 0)
                state.isFirstStory = true;
            else
                state.isFirstStory = false;
            state.isDataReady = true;
        },
        resetViewAll(state, action) {
            state.isViewAll = false;
        },
        incrementProgress(state, action) {
            if (!state.isPause)
                state.progress += 1;
        },
        resetProgress(state, action) {
            state.progress = 0;
        },
        setProgress(state, action) {
            state.progress -= 4;
        },
        setGettingData(state, action) {
            state.gettingData = action.payload;
        },
        setIsPause(state, action) {
            state.isPause = action.payload;
        },
        setLike(state, action) {
            state.profilesStoriesList[state.profileIdx][1][state.storyIdx]['is_like'] = action.payload
        },
        updateSeen(state, action) {
            state.profilesStoriesList[state.profileIdx][1][state.storyIdx]['is_seen'] = true;
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

export const storySeen = (storyId) => {
    const url = myConfig.hostName + '/stories/view/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'id': storyId });
    const successHandler = (data) => storyBoardActions.updateSeen(data);

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const storyLike = (storyId) => {
    const url = myConfig.hostName + '/stories/like-unlike/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'id': storyId });
    const successHandler = (data) => (dispatch) => {
        const is_like = data['type'] === 'like' ? true : false;
        dispatch(storyBoardActions.setLike(is_like));
    };

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default storyBoardSlice;