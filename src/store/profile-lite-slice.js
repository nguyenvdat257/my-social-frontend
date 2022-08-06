import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { postActions } from './post-timeline-slice';
import { toastActions } from './toast-slice';

const profileLiteSlice = createSlice({
    name: 'profileLiteSlice',
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
        }
    }
})


export const profileLiteActions = profileLiteSlice.actions;

export const callGetProfileLite = (username) => {
    const url = myConfig.hostName + `/profiles/username/${username}/`;
    const method = 'GET';
    const formData = null
    const successHandler = (data) => profileLiteActions.setProfile(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetPostsLite = (username) => {
    const url = myConfig.hostName + `/posts/username/${username}/`;
    const method = 'GET';
    const formData = null
    const successHandler = (data) => profileLiteActions.setPosts(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export default profileLiteSlice