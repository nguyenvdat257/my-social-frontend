import { toastActions } from './toast-slice';
import { callApi } from './actions';
import { myConfig } from '../config';
import { profileModalActions } from './profile-modal-slice';
import store from '.';

export const callFollow = (username, setGettingData, setFollowData) => {
    const url = myConfig.hostName + '/follows/follow-unfollow/';
    const method = 'PUT';
    const sendData = JSON.stringify({ username: username });
    const successHandler = (data) => profileModalActions.setFollowData({ data: data, username: username });
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => () => setGettingData(true);
    const afterConnected = () => () => setGettingData(false);
    const afterUnconnected = () => () => setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}


export const callLikePostProfile = postCode => setGettingData => {
    const url = myConfig.hostName + `/posts/like-profile/code/${postCode}/`;
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

export const callNextProfile = setGettingData => {
    const state = store.getState();
    const nextUrl = state.profileModal.nextUrl;
    if (nextUrl === null)
        return
    const url = nextUrl;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => profileModalActions.setNextData(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => () => setGettingData(true);
    const afterConnected = () => () => setGettingData(false);
    const afterUnconnected = () => () => setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callLikeCommentProfile = commentId => setGettingData => {
    const url = myConfig.hostName + `/comments/like-profile/${commentId}/`;
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
