import { createSlice } from '@reduxjs/toolkit';
import { toastActions } from './toast-slice';
import { callApi } from './actions';
import { myConfig } from '../config';
import { createPostSlice } from './create-postslice-wrapper';
import { postActions } from './post-timeline-slice';

const postSlice = createPostSlice('post');

export const callGetPost = (postCode) => {
    const url = myConfig.hostName + `/posts/code/${postCode}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => postActions.setPost(data);

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => postActions.setGettingData(true);
    const afterConnected = () => postActions.setGettingData(false);
    const afterUnconnected = () => postActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default postSlice;

