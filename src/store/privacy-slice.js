import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';

const privacySlice = createSlice({
    name: 'privacy',
    initialState: {
        accountType: 'PU',
        showActivity: true,
        prevAccountType: 'PU',
        prevShowActivity: true,
        gettingData: true,
        sendingData: false,
    },
    reducers: {
        setAccountType(state, action) {
            state.accountType = action.payload;
        },
        setShowActivity(state, action) {
            state.showActivity = action.payload;
        },
        setPrevAccountType(state, action) {
            state.prevAccountType = state.accountType;
        },
        setPrevShowActivity(state, action) {
            state.prevShowActivity = state.showActivity;
        },
        resetState(state, action) {
            state.accountType = state.prevAccountType;
            state.showActivity = state.prevShowActivity;
        },
        setGettingData(state, action) {
            state.gettingData = action.payload;
        },
        setSendingData(state, action) {
            state.sendingData = action.payload;
        }
    }
})


export const privacyActions = privacySlice.actions;

export const getData = () => {
    const url = myConfig.hostName + '/profiles/';
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => (dispatch) => {
        dispatch(privacyActions.setAccountType(data['account_type']));
        dispatch(privacyActions.setShowActivity(data['show_activity']));
    };

    const failHandler = (data)  => {
        toastActions.setIsShow(myConfig.getError);
    };
    const exceptHandler = () =>  {
        toastActions.setIsShow(myConfig.serverError);
    };
    const before = null;
    const afterConnected = () => privacyActions.setGettingData(false);
    const afterUnconnected = () => privacyActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const submitData = (formData) => {
    const url = myConfig.hostName + '/profiles/';
    const method = 'PUT';
    // const sendData = formData;
    const successHandler = (data) => (dispatch) => {
        dispatch(privacyActions.setAccountType(data['account_type']));
        dispatch(privacyActions.setShowActivity(data['show_activity']));
        dispatch(toastActions.setIsShow(myConfig.settingSaved));
    }
    const failHandler = (data) => (dispatch) => {
        dispatch(privacyActions.resetState());
        dispatch(toastActions.setIsShow(myConfig.sendError));
    }
    const exceptHandler = () => (dispatch) => {
        dispatch(privacyActions.resetState());
        dispatch(toastActions.setIsShow(myConfig.serverError));
    }
    const before = ()  => privacyActions.setSendingData(true);
    const afterConnected = () => privacyActions.setSendingData(false);
    const afterUnconnected = () => privacyActions.setSendingData(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default privacySlice;