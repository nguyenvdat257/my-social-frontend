import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';
import { postUserActions } from './post-timeline-slice';
import { createPostSlice } from './create-postslice-wrapper';

const postUserSlice = createPostSlice('postUser');


export const callGetPostAndRecent = (postCode) => {
    const url = myConfig.hostName + `/posts/code-and-recent/${postCode}/`;
    const method = 'GET';
    const formData = null;
    const successHandler = (data) => postUserActions.setData(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => postUserActions.setGettingData(true);
    const afterConnected = () => postUserActions.setGettingData(false);
    const afterUnconnected = () => postUserActions.setGettingData(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export default postUserSlice;