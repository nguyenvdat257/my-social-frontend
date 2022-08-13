import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { postActions } from './post-timeline-slice';
import { toastActions } from './toast-slice';

const profileSlice = createSlice({
    name: 'profileSlice',
    initialState: {
        profile: null,
    },
    reducers: {
        setProfile(state, action) {
            state.profile = action.payload;
            state.profileLoaded = true;
        },
        setFollowData(state, action) {
            const isFollow = action.payload.data.type === 'follow' ? true : false;
            state.profile.is_follow = isFollow;
        }
    }
})


export const profileActions = profileSlice.actions;

export const callGetProfile = (username) => {
    const url = myConfig.hostName + `/profiles/username/${username}/`;
    const method = 'GET';
    const formData = null
    const successHandler = (data) => profileActions.setProfile(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetPosts = (username) => {
    const url = myConfig.hostName + `/posts/username/${username}/`;
    const method = 'GET';
    const formData = null
    const successHandler = (data) => postActions.setData(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetSavedPosts = () => {
    const url = myConfig.hostName + '/posts/saved/';
    const method = 'GET';
    const formData = null
    const successHandler = (data) => postActions.setData(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export default profileSlice;