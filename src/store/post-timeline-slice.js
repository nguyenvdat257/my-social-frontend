import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';
import postSlice from './post-slice';
import {createPostSlice} from './create-postslice-wrapper'
import postSuggestSlice from './post-suggest-slice';
import postUserSlice from './postuser-slice';

const postTimeLineSlice = createPostSlice('postTimeline');


export const postTimelineActions = postTimeLineSlice.actions;
export const postActions = postSlice.actions;
export const postSuggestActions = postSuggestSlice.actions;
export const postUserActions = postUserSlice.actions;

export const callGetData = (type) => {
    const url = myConfig.hostName + '/posts/current-user/';
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => eval(type + 'Actions.setData(data)');

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => eval(type + 'Actions.setGettingData(true)');
    const afterConnected = () => eval(type + 'Actions.setGettingData(false)');
    const afterUnconnected = () => eval(type + 'Actions.setGettingData(false)');
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetNextData = (type, nextUrl) => {
    const url = nextUrl;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => eval(type + 'Actions.setNextData(data)');

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => eval(type + 'Actions.setGettingData(true)');
    const afterConnected = () => eval(type + 'Actions.setGettingData(false)');
    const afterUnconnected = () => eval(type + 'Actions.setGettingData(false)');
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callPostSave = (type, postCode) => {
    const url = myConfig.hostName + '/posts/save-unsave/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'post_code': postCode });
    const successHandler = (data) => eval(type + 'Actions.updateSave({ data: data, code: postCode })');

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(eval(type + 'Actions.flipSave({ code: postCode })'));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(eval(type + 'Actions.flipSave({ code: postCode })'));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callPostLike = (type, postCode) => {
    const url = myConfig.hostName + '/posts/like-unlike/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'post_code': postCode });
    const successHandler = (data) => eval(type + 'Actions.updateLike({ data: data, code: postCode })');

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(eval(type + 'Actions.flipLike({ code: postCode })'));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(eval(type + 'Actions.flipLike({ code: postCode })'));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callDeletePost = (type, postCode) => {
    const url = myConfig.hostName + `/posts/code/${postCode}/`;
    const method = 'DELETE';
    const sendData = null;
    const successHandler = (data) => dispatch => {
        dispatch(eval(type + 'Actions.updateDeletePost({ postCode: postCode })'));
        dispatch(toastActions.setIsShow(myConfig.deletedPost));
    }

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export const callDeleteComment = (type, postCode, commentId, replyId) => {
    const url = myConfig.hostName + `/comments/${commentId}/`;
    const method = 'DELETE';
    const sendData = null;
    const successHandler = (data) => eval(type + 'Actions.updateDeleteComment({ commentId: commentId, replyId: replyId, postCode: postCode })');

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = (data) => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export const callCommentLike = (type, { postCode, commentId, replyId }) => {
    const url = myConfig.hostName + '/comments/like-unlike/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'id': replyId ? replyId : commentId });
    const successHandler = (data) => eval(type + 'Actions.updateLikeComment({ data: data, commentId: commentId, replyId: replyId, postCode: postCode })');

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(eval(type + 'Actions.flipLikeComment({ commentId: commentId, replyId: replyId, postCode: postCode })'));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(eval(type + 'Actions.flipLikeComment({ commentId: commentId, replyId: replyId, postCode: postCode })'));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callSendMessage = (type, message, postCode) => {
    const url = myConfig.hostName + '/comments/';
    const method = 'POST';
    const sendData = JSON.stringify({ post_code: postCode, body: message });
    const successHandler = (data) => eval(type + 'Actions.updateNewComment({ data: data, code: postCode })');

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(eval(type + 'Actions.undoNewComment({ code: postCode })'));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(eval(type + 'Actions.undoNewComment({ code: postCode })'));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetComments = (type, postCode) => {
    const url = myConfig.hostName + `/comments/post-code/${postCode}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => eval(type + 'Actions.setCommentData({ code: postCode, data: data })');

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => eval(type + 'Actions.setGettingComment(true)');
    const afterConnected = () => eval(type + 'Actions.setGettingComment(false)');
    const afterUnconnected = () => eval(type + 'Actions.setGettingComment(false)');
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetNextComment = (type, postCode, nextUrl) => {
    const url = nextUrl;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => eval(type + 'Actions.setNextCommentData({ code: postCode, data: data })');

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => eval(type + 'Actions.setGettingComment(true)');
    const afterConnected = () => eval(type + 'Actions.setGettingComment(false)');
    const afterUnconnected = () => eval(type + 'Actions.setGettingComment(false)');
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetReplyComments = (type, postCode, commentId) => {
    const url = myConfig.hostName + `/comments/reply-comments/${commentId}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => eval(type + 'Actions.setReplyComment({ postCode: postCode, commentId: commentId, data: data })');

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => eval(type + 'Actions.setGettingReplyComment({ id: commentId, value: true })');
    const afterConnected = () => eval(type + 'Actions.setGettingReplyComment({ id: commentId, value: false })');
    const afterUnconnected = () => eval(type + 'Actions.setGettingReplyComment({ id: commentId, value: false })');
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callSendReply = (type, message, postCode, replyTo) => {
    const url = myConfig.hostName + '/comments/';
    const method = 'POST';
    const sendData = JSON.stringify({ post_code: postCode, body: message, reply_to: replyTo });
    const successHandler = (data) => (dispatch) => {
        dispatch(eval(type + 'Actions.updateNewReply({ data: data, code: postCode, commentId: replyTo })'));
        // eval(type + 'Actions.callGetReplyComments
    };

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(eval(type + 'Actions.undoNewReply({ code: postCode, commentId: replyTo })'));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(eval(type + 'Actions.undoNewReply({ code: postCode, commentId: replyTo })'));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callEditPost = (type, formData, postCode) => {
    const url = myConfig.hostName + `/posts/code/${postCode}/`;
    const method = 'PUT';
    const sendData = formData;
    const successHandler = (data) => dispatch => {
        dispatch(eval(type + 'Actions.setEditPost({ data: data, postCode: postCode })'));
        dispatch(toastActions.setIsShow(myConfig.editedPost));
    };
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetPost = (type, postCode) => {
    const url = myConfig.hostName + `/posts/code/${postCode}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => eval(type + 'Actions.setPost(data)');

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => eval(type + 'Actions.setGettingData(true)');
    const afterConnected = () => eval(type + 'Actions.setGettingData(false)');
    const afterUnconnected = () => eval(type + 'Actions.setGettingData(false)');
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default postTimeLineSlice;