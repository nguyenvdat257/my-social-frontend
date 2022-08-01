import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';
import { getCroppedImg } from '../components/PostAdd/CropBody';

const profileSuggestSlice = createSlice({
    name: 'postAdd',
    initialState: {
        profiles: [],
        profileSuggestLoaded: false
    },
    reducers: {
        updateProfiles(state, action) {
            state.profiles = action.payload;
            state.profileSuggestLoaded = true;
        },
        setFollowData(state, action) {
            const profileIdx = state.profiles.findIndex(profile => profile.username === action.payload.username);
            const isFollow = action.payload.data.type === 'follow' ? true : false;
            state.profiles[profileIdx].is_follow = isFollow;
        }
    }
})


export const profileSuggestActions = profileSuggestSlice.actions;

export const callGetSuggestProfile = (formData) => {
    const url = myConfig.hostName + '/profiles/suggest/';
    const method = 'GET';
    const successHandler = (data) => profileSuggestActions.updateProfiles(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export default profileSuggestSlice;