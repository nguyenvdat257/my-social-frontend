import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';
import { storyBoardActions } from './story-board-slice';
import { profileModalActions } from './profile-modal-slice';

const storySlice = createSlice({
    name: 'story',
    initialState: {
        profilesStoriesList: [],
        progress: 0,
        isPause: false,
        profileIdx: 0,
        storyIdx: 0,
        isDataReady: false,
        isViewAll: false,
        isFirstStory: true,
    },
    reducers: {
        setStoriesList(state, action) {
            state.profilesStoriesList = action.payload;
        },
        resetState(state, action) {
            state.profilesStoriesList = [];
            state.progress = 0;
            state.isPause = false;
            state.profileIdx = 0;
            state.storyIdx = 0;
            state.isDataReady = false;
            state.isViewAll = false;
            state.isFirstStory = true;
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
        setIsPause(state, action) {
            state.isPause = action.payload;
        },
        setLike(state, action) {
            state.profilesStoriesList[action.payload.profileIdx][1][action.payload.storyIdx]['is_like'] = action.payload.data;
        },
        updateSeen(state, action) {
            state.profilesStoriesList[action.payload.profileIdx][1][action.payload.storyIdx]['is_seen'] = true;
        }
    }
})


export const storyActions = storySlice.actions;

export const callStorySeen = (profileIdx, storyIdx, storyId) => {
    const url = myConfig.hostName + '/stories/view/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'id': storyId });
    const successHandler = (data) => storyActions.updateSeen({ profileIdx: profileIdx, storyIdx: storyIdx });

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callStoryLike = (profileIdx, storyIdx, storyId) => {
    const url = myConfig.hostName + '/stories/like-unlike/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'id': storyId });
    const successHandler = (data) => (dispatch) => {
        const is_like = data['type'] === 'like' ? true : false;
        dispatch(storyActions.setLike({ data: is_like, profileIdx: profileIdx, storyIdx: storyIdx }));
    };

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}


export const callGetStoryViewProfile = storyId => setGettingData => {
    const url = myConfig.hostName + `/stories/${storyId}/activity/`;
    const method = 'GET';
    const sendData = null;

    const successHandler = (data) => profileModalActions.setData(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => () => setGettingData(true);
    const afterConnected = () => () => setGettingData(false);
    const afterUnconnected = () => () => setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callStorySendReply = formData => {
    const url = myConfig.hostName + `/stories/reply/`;
    const method = 'POST';
    const sendData = formData;

    const successHandler = (data) => toastActions.setIsShow(myConfig.sent);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default storySlice;