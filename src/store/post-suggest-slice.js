import { toastActions } from './toast-slice';
import { callApi } from './actions';
import { myConfig } from '../config';
import { createPostSlice } from './create-postslice-wrapper';
import {postSuggestActions } from './post-timeline-slice';

const postSuggestSlice = createPostSlice('postSuggest');

export const callGetPostSuggest = () => {
    const url = myConfig.hostName + `/posts/suggest/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => postSuggestActions.setData(data);

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => postSuggestActions.setGettingData(true);
    const afterConnected = () => postSuggestActions.setGettingData(false);
    const afterUnconnected = () => postSuggestActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default postSuggestSlice;

