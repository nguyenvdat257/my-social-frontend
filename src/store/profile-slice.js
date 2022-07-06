import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        avatarUrl: '',
        displayUsername: '',
        username: '',
        name: '',
        website: '',
        bio: '',
        gender: '',
        gettingData: true,
        sendingData: false,
        editError: { 'isError': false, 'message': '' },
        editSuccess: { 'isSuccess': false, 'message': '' },
    },
    reducers: {
        setAvatarUrl(state, action) {
            state.avatarUrl = action.payload
        },
        setUsername(state, action) {
            state.username = action.payload
        },
        setName(state, action) {
            state.name = action.payload
        },
        setWebsite(state, action) {
            state.website = action.payload
        },
        setBio(state, action) {
            state.bio = action.payload
        },
        setGender(state, action) {
            state.gender = action.payload
        },
        setData(state, action) {
            state.avatarUrl = myConfig.hostName + action.payload.avatar.thumbnail_larger;
            state.displayUsername = action.payload.username;
            state.username = action.payload.username;
            state.name = action.payload.name ? action.payload.name : '';
            state.website = action.payload.website ? action.payload.website : '';
            state.bio = action.payload.bio ? action.payload.bio : '';
            state.gender = action.payload.gender ? action.payload.gender : 'N';
        },
        resetData(state, action) {
            state.avatarUrl = '';
            state.displayUsername = '';
            state.username = '';
            state.name = '';
            state.website = '';
            state.bio = '';
            state.gender = '';
            state.gettingData = true;
            state.sendingData = false;
            state.editError = { 'isError': false, 'message': '' };
            state.editSuccess = { 'isSuccess': false, 'message': '' };
        },
        editedSuccess(state, action) {
            state.editSuccess = { 'isSuccess': true, 'message': 'You successfully updated your profile!' };
            state.editError = { 'isError': false, 'message': '' }
        },
        editedError(state, action) {
            if (action.payload.includes('username')) {
                state.editError = { 'isError': true, 'message': 'Sorry, this username is already used.' }
            }
            else if (action.payload.includes('website')) {
                state.editError = { 'isError': true, 'message': 'Sorry, this website is not a valid url.' }
            }
            state.editSuccess = { 'isSuccess': false, 'message': '' }

        },
        setGettingData(state, action) {
            state.gettingData = action.payload;
        },
        setEditError(state, action) {
            state.editError = action.payload
        },
        setSendingData(state, action) {
            state.sendingData = action.payload;
        }
    }
})


export const profileActions = profileSlice.actions;

export const getData = () => {
    const url = myConfig.hostName + '/profiles/';
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => profileActions.setData(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => profileActions.setGettingData(true);
    const afterConnected = () => profileActions.setGettingData(false);
    const afterUnconnected = () => profileActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const submitData = (formData) => {
    const url = myConfig.hostName + '/profiles/';
    const method = 'PUT';
    // const sendData = formData;
    const successHandler = (data) => (dispatch) => {
        dispatch(profileActions.setData(data));
        dispatch(profileActions.editedSuccess());
    }
    const failHandler = (data) => profileActions.editedError(data);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => profileActions.setSendingData(true);
    const afterConnected = () => profileActions.setSendingData(false);
    const afterUnconnected = () => profileActions.setSendingData(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export default profileSlice;