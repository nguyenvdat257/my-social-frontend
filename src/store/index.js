import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import signupSlice from "./signup-slice";
import privacySlice from "./privacy-slice";
import toastSlice from "./toast-slice";
import storyBoardSlice from "./story-board-slice";
import postTimeLineSlice from "./post-timeline-slice";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from "redux";
import profileModalSlice from "./profile-modal-slice";
import postAddSlice from "./post-add-slice";
import confirmSlice from "./confirm-modal-slice";
import optionSlice from "./option-modal-slice";
import postEditSlice from "./post-edit-slice";
import profileSuggestSlice from "./profile-suggest-slice";
import storySlice from "./story-slice";
import searchSlice from "./search-slice";
import clickSlice from "./click-slice";
import profileEditSlice from "./profile-edit-slice";
import profileSlice from "./profile-slice";
import postSlice from "./post-slice";
import profilePreviewSlice from "./profile-preview-slice";
import postSuggestSlice from "./post-suggest-slice";
import chatSlice from "./chat-slice";
import notificationSlice from "./notification-slice";
import postUserSlice from "./postuser-slice";
import headerSlice from "./header-slice";


const persistConfig = {
    key: 'root',
    whitelist: ['auth'],
    storage
};

const reducers = combineReducers({
    auth: authSlice.reducer,
    signup: signupSlice.reducer,
    profileEdit: profileEditSlice.reducer,
    privacy: privacySlice.reducer,
    toast: toastSlice.reducer,
    storyBoard: storyBoardSlice.reducer,
    story: storySlice.reducer,
    postTimeline: postTimeLineSlice.reducer,
    postEdit: postEditSlice.reducer,
    post: postSlice.reducer,
    profileModal: profileModalSlice.reducer,
    postAdd: postAddSlice.reducer,
    confirm: confirmSlice.reducer,
    option: optionSlice.reducer,
    profileSuggest: profileSuggestSlice.reducer,
    search: searchSlice.reducer,
    click: clickSlice.reducer,
    profile: profileSlice.reducer,
    profilePreview: profilePreviewSlice.reducer,
    postSuggest: postSuggestSlice.reducer,
    chat: chatSlice.reducer,
    notification: notificationSlice.reducer,
    postUser: postUserSlice.reducer,
    header: headerSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});

export default store