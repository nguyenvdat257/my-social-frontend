import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';
import moment from 'moment'

const notificationSlice = createSlice({
    name: 'notfication',
    initialState: {
        notifications: [],
        separatorPos: {},
        nextUrl: null,
        usedNextUrl: [],
        showNoti: false,
        gettingData: false,
        gettingNextData: false,
    },
    reducers: {
        setNotfication(state, action) {
            state.notifications = state.notifications.concat(action.payload.results);
            state.nextUrl = action.payload.next
            let foundEarlierPos = false;
            let foundTodayPost = false;
            const todayDate = moment().format('YYYY MM DD');
            for (let i = 0; i < state.notifications.length; i++) {
                const itemCreatedDate = moment(state.notifications[i].created).format('YYYY MM DD')
                if (!foundTodayPost && todayDate === itemCreatedDate) {
                    state.separatorPos['todayPos'] = i;
                    foundTodayPost = true;
                } else if (!foundEarlierPos && todayDate !== itemCreatedDate) {
                    state.separatorPos['earlierPos'] = i;
                    foundEarlierPos = true;
                }
            }
        },
        setShowNoti(state, action) {
            state.showNoti = action.payload;
        },
        setGettingData(state, action) {
            state.gettingData = action.payload;
        },
        setGettingNextData(state, action) {
            state.gettingNextData = action.payload;
        },
        appendUsedNextUrl(state, action) {
            state.usedNextUrl.push(action.payload);
        },
        resetData(state, action) {
            state.notifications = [];
            state.separatorPos = {};
            state.nextUrl = null;
            state.usedNextUrl = [];
            state.showNoti = false;
            state.gettingData = false;
            state.gettingNextData = false;
        },
    }
})


export const notificationActions = notificationSlice.actions;

export const callGetNotifications = () => {
    const url = myConfig.hostName + '/notification/';
    const method = 'GET';
    const formData = null;
    const successHandler = (data) => notificationActions.setNotfication(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => notificationActions.setGettingData(true);
    const afterConnected = () => notificationActions.setGettingData(false);
    const afterUnconnected = () => notificationActions.setGettingData(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetNextNotifications = (nextUrl) => {
    const url = nextUrl;
    const method = 'GET';
    const formData = null;
    const successHandler = (data) => notificationActions.setNotfication(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => notificationActions.setGettingNextData(true);
    const afterConnected = () => notificationActions.setGettingNextData(false);
    const afterUnconnected = () => notificationActions.setGettingNextData(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default notificationSlice;