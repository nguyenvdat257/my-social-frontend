import { createSlice } from '@reduxjs/toolkit';
import { toastActions } from './toast-slice';
import { callApi } from './actions';
import { myConfig } from '../config';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        recentSearches: [],
        profiles: [],
        tags: [],
        recentLoaded: false,
        gettingData: false,
        currentType: ''
    },
    reducers: {
        setRecentSearches(state, action) {
            const items = action.payload.map(item => {
                if (item.search_profile)
                    return { type: 'profile', data: item.search_profile, searchId: item.id }
                else
                    return { type: 'tag', data: item.search_hashtag, searchId: item.id }
            })
            state.recentSearches = items;
            state.recentLoaded = true;
            state.currentType = 'recent'
        },
        deleteRecentSearch(state, action) {
            state.recentSearches = state.recentSearches.filter(item => item.searchId != action.payload.id)
        },
        deleteAllSearch(state, action) {
            state.recentSearches = [];
        },
        updateSavedItems(state, action) {
            state.recentSearches.unshift(action.payload);
        },
        setTags(state, action) {
            state.tags = action.payload;
            state.currentType = 'tag'
        },
        setProfiles(state, action) {
            state.profiles = action.payload;
            state.currentType = 'profile'
        },
        setCurrentType(state, action) {
            state.currentType = action.payload;
        },
        setGettingData(state, action) {
            state.gettingData = action.payload
        }
    }
})

export const searchActions = searchSlice.actions;

export const callGetSavedSearch = () => {
    const url = myConfig.hostName + '/recent-searches';
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => searchActions.setRecentSearches(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => searchActions.setGettingData(true);
    const afterConnected = () => searchActions.setGettingData(false);
    const afterUnconnected = () => searchActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callSearchProfile = (keyword) => {
    const url = myConfig.hostName + `/profiles/search/${keyword}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => searchActions.setProfiles(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => searchActions.setGettingData(true);
    const afterConnected = () => searchActions.setGettingData(false);
    const afterUnconnected = () => searchActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callSearchTag = (keyword) => {
    const url = myConfig.hostName + `/hashtags/search/${keyword}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => searchActions.setTags(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => searchActions.setGettingData(true);
    const afterConnected = () => searchActions.setGettingData(false);
    const afterUnconnected = () => searchActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callDeleteSearch = (id) => {
    const url = myConfig.hostName + `/recent-searches/${id}/`;
    const method = 'DELETE';
    const sendData = null;
    const successHandler = (data) => searchActions.deleteRecentSearch({ id: id });
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callClearAllSearch = () => {
    const url = myConfig.hostName + `/recent-searches/`;
    const method = 'DELETE';
    const sendData = null;
    const successHandler = (data) => searchActions.deleteAllSearch();
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callUpdateSearch = (data) => {
    const url = myConfig.hostName + `/recent-searches/`;
    const method = 'POST';
    const sendData = JSON.stringify(data);
    const successHandler = (data) => searchActions.setRecentSearches(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default searchSlice;

