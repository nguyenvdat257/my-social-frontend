import { postActions } from "./post-timeline-slice";
import { toastActions } from "./toast-slice";
import { callApi } from "./actions";
import { myConfig } from "../config";

export const callGetPostByTag = (tag) => {
    const url = myConfig.hostName + `/posts/tag-popular/${tag}/`;
    const method = 'GET';
    const formData = null;
    const successHandler = (data) => postActions.setData(data);
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);
    const before = () => postActions.setGettingData(true);
    const afterConnected = () => postActions.setGettingData(false);
    const afterUnconnected = () => postActions.setGettingData(false);
    return callApi(url, method, formData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}