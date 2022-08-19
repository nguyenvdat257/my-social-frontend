import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { postActions } from './post-timeline-slice';
import { toastActions } from './toast-slice';

const profilePreviewSlice = createSlice({
    name: 'profilePreviewSlice',
    initialState: {
        profile: null,
        posts: [],
        profileLoaded: false,
        postsLoaded: false
    },
    reducers: {
        setProfile(state, action) {
            state.profile = action.payload;
            state.profileLoaded = true;
        },
        setPosts(state, action) {
            state.posts = action.payload.results.slice(0, 3);
            state.postsLoaded = true;
        },
        setFollowData(state, action) {
            const isFollow = action.payload.data.type === 'follow' ? true : false;
            state.profile.is_follow = isFollow;
        },
        resetState(state, action) {
            state.profile = null;
            state.posts = [];
            state.profileLoaded = false;
            state.postsLoaded = false;
        }

    }
})


export const profilePreviewActions = profilePreviewSlice.actions;

export const callGetProfilePreview = (username) => {
    const url = myConfig.hostName + `/profiles/username/${username}/`;
    const method = 'GET';
    const formData = null
    const successHandler = (data) => profilePreviewActions.setProfile(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetPostsPreview = (username) => {
    const url = myConfig.hostName + `/posts/username/${username}/`;
    const method = 'GET';
    const formData = null
    const successHandler = (data) => profilePreviewActions.setPosts(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export default profilePreviewSlice