import { createSlice } from '@reduxjs/toolkit';
import { myConfig } from '../config';
import { callApi } from './actions';
import { toastActions } from './toast-slice';

const postTimeLineSlice = createSlice({
    name: 'PostTimeLine',
    initialState: {
        posts: [],
        nextUrl: null,
        usedNextUrl: [],
        nextCommentUrl: null,
        usedNextCommentUrl: [],
        gettingData: false,
        gettingComment: false,
        commentLoaded: false,
        replyTo: null,
        postProps: {},
        commentProps: {},
    },
    reducers: {
        resetState(state, action) {
            state.posts = [];
            state.nextUrl = null;
            state.usedNextUrl = [];
            state.nextCommentUrl = null;
            state.usedNextCommentUrl = [];
            state.gettingData = false;
            state.gettingComment = false;
            state.commentLoaded = false;
            state.replyTo = null;
            state.postProps = {};
            state.commentProps = {};
        },
        setReplyTo(state, action) {
            state.replyTo = action.payload
        },
        setGettingReplyComment(state, action) {
            state.commentProps[action.payload.id].gettingReplyComment = action.payload.value;
        },
        setShowReply(state, action) {
            state.commentProps[action.payload.id].showReply = action.payload.value;
        },
        setMessage(state, action) {
            state.postProps[action.payload.postCode].message = action.payload.value;
        },
        setShowPostMain(state, action) {
            state.postProps[action.payload.postCode].showPostMain = action.payload.value;
        },
        setData(state, action) {
            state.posts = action.payload.results
            state.nextUrl = action.payload.next
            state.gettingData = false;
            for (const post of action.payload.results)
                state.postProps[post.code] = { showPostMain: false, message: '' };
        },
        appendUsedNextUrl(state, action) {
            state.usedNextUrl.push(action.payload);
        },
        appendUsedNextCommentUrl(state, action) {
            state.usedNextCommentUrl.push(action.payload);
        },
        setNextData(state, action) {
            state.posts = state.posts.concat(action.payload.results);
            // state.posts.push(action.payload.results[0])
            // state.posts.push(action.payload.results[1])
            state.nextUrl = action.payload.next;
            // state.usedNextUrl.push(action.payload.next);
            state.gettingData = false;
            for (const post of action.payload.results)
                state.postProps[post.code] = { showPostMain: false, message: '' };
        },
        setCommentData(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[postIndex];
            post.comments = action.payload.data.results;
            state.nextCommentUrl = action.payload.data.next;
            state.gettingComment = false;
            state.commentLoaded = true;
            for (const comment of action.payload.data.results)
                state.commentProps[comment.id] = { gettingReplyComment: false, showReply: false };
        },
        setNextCommentData(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[postIndex];
            post.comments = post.comments.concat(action.payload.data.results);
            state.nextCommentUrl = action.payload.data.next;
            // state.usedNextCommentUrl.push(action.payload.data.next);
            state.gettingComment = false;
            for (const comment of action.payload.data.results)
                state.commentProps[comment.id] = { gettingReplyComment: false, showReply: false };
        },
        setReplyComment(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.postCode));
            const post = state.posts[postIndex];
            const commentIndex = post.comments.findIndex((comment => comment.id === action.payload.commentId));
            const comment = post.comments[commentIndex];
            comment.reply_comments = action.payload.data.results;
            for (const comment of action.payload.data.results)
                state.commentProps[comment.id] = { gettingReplyComment: false, showReply: false };
        },
        setGettingData(state, action) {
            state.gettingData = action.payload;
        },
        setGettingComment(state, action) {
            state.gettingComment = action.payload;
        },
        closePostModal(state, action) {
            state.nextCommentUrl = null;
            state.showPostMain = false;
            state.gettingData = false;
            state.gettingComment = false;
            state.commentLoaded = false;
            state.replyTo = null;
            state.postProps[action.payload.postCode].showPostMain = false;
        },
        updateSave(state, action) {
            const objIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const saveType = action.payload.data.type === 'save' ? true : false;
            state.posts[objIndex].is_saved = saveType;
        },
        updateLike(state, action) {
            const objIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const likeType = action.payload.data.type === 'like' ? true : false;
            state.posts[objIndex].is_like = likeType;
            state.posts[objIndex].likes_count = action.payload.data.likes_count;
        },
        updateDeletePost(state, action) {
            state.posts = state.posts.filter(post => post.code != action.payload.postCode)
        },
        updateLikeComment(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.postCode));
            const post = state.posts[postIndex];
            const commentIndex = post.comments.findIndex((comment => comment.id === action.payload.commentId));
            const comment = post.comments[commentIndex];
            const likeType = action.payload.data.type === 'like' ? true : false;
            if (action.payload.replyId) {
                const replyCommentIndex = comment.reply_comments.findIndex((replyComment => replyComment.id === action.payload.replyId));
                const replyComment = comment.reply_comments[replyCommentIndex];
                replyComment.is_like = likeType;
            }
            else {
                comment.is_like = likeType;
            }
        },
        updateTemporaryNewComment(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[postIndex];
            const newComment = {
                username: action.payload.user.username,
                body: action.payload.message,
                is_like: false,
                avatar: action.payload.user.avatar
            }
            post.comments.unshift(newComment);
            post.comments_count += 1;
        },
        updateNewComment(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[postIndex];
            post.comments.shift();
            post.comments.unshift(action.payload.data);
        },
        undoNewComment(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[postIndex];
            post.comments.shift();
            post.comments_count -= 1;

        },
        updateTemporaryNewReply(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[postIndex];
            const commentIndex = post.comments.findIndex((comment => comment.id === action.payload.commentId));
            const comment = post.comments[commentIndex];
            const newComment = {
                username: action.payload.user.username,
                body: action.payload.message,
                is_like: false,
                avatar: action.payload.user.avatar
            }
            if (comment.reply_comments === undefined)
                comment.reply_comments = [newComment];
            else
                comment.reply_comments.unshift(newComment);
            comment.reply_count += 1;
        },
        updateNewReply(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[postIndex];
            const commentIndex = post.comments.findIndex((comment => comment.id === action.payload.commentId));
            const comment = post.comments[commentIndex];
            comment.reply_comments.shift();
            comment.reply_comments.unshift(action.payload.data);
        },
        undoNewReply(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[postIndex];
            const commentIndex = post.comments.findIndex((comment => comment.id === action.payload.commentId));
            const comment = post.comments[commentIndex];
            comment.reply_comments.shift();
            comment.reply_count -= 1;

        },
        flipLike(state, action) {
            const objIndex = state.posts.findIndex((post => post.code === action.payload.code));
            const post = state.posts[objIndex]
            const increment = post.is_like ? -1 : 1;
            post.likes_count += increment;
            post.is_like = !post.is_like;
        },
        flipLikeComment(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.postCode));
            const post = state.posts[postIndex];
            const commentIndex = post.comments.findIndex((comment => comment.id === action.payload.commentId));
            const comment = post.comments[commentIndex];
            if (action.payload.replyId) {
                const replyCommentIndex = comment.reply_comments.findIndex((replyComment => replyComment.id === action.payload.replyId));
                const replyComment = comment.reply_comments[replyCommentIndex];
                const increment = replyComment.is_like ? -1 : 1;
                replyComment.likes_count += increment;
                replyComment.is_like = !replyComment.is_like;
            }
            else {
                const increment = comment.is_like ? -1 : 1;
                comment.likes_count += increment;
                comment.is_like = !comment.is_like;
            }
        },
        updateDeleteComment(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.postCode));
            const post = state.posts[postIndex];
            if (action.payload.replyId) {
                const commentIndex = post.comments.findIndex((comment => comment.id === action.payload.commentId));
                const comment = post.comments[commentIndex];
                comment.reply_comments = comment.reply_comments.filter(cm => cm.id != action.payload.replyId)
                comment.reply_count -= 1;
            }
            else {
                post.comments = post.comments.filter(cm => cm.id != action.payload.commentId);
                post.comments_count -= 1;
            }
        },
        flipSave(state, action) {
            const objIndex = state.posts.findIndex((post => post.code === action.payload.code));
            state.posts[objIndex]['is_saved'] = !state.posts[objIndex]['is_saved'];
        },
        setFollowData(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.props.postCode));
            const post = state.posts[postIndex];
            const isFollow = action.payload.data.type === 'follow' ? true : false;
            post.profile_info.is_follow = isFollow;
        },
        setEditPost(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.postCode));
            state.posts[postIndex] = action.payload.data;
        }
    }
})


export const postTimelineActions = postTimeLineSlice.actions;

export const callGetData = () => {
    const url = myConfig.hostName + '/posts/current-user/';
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => postTimelineActions.setData(data);

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => postTimelineActions.setGettingData(true);
    const afterConnected = () => postTimelineActions.setGettingData(false);
    const afterUnconnected = () => postTimelineActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetNextData = (nextUrl) => {
    const url = nextUrl;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => postTimelineActions.setNextData(data);

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => postTimelineActions.setGettingData(true);
    const afterConnected = () => postTimelineActions.setGettingData(false);
    const afterUnconnected = () => postTimelineActions.setGettingData(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callPostSave = (postCode) => {
    const url = myConfig.hostName + '/posts/save-unsave/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'post_code': postCode });
    const successHandler = (data) => postTimelineActions.updateSave({ data: data, code: postCode });

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(postTimelineActions.flipSave({ code: postCode }));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(postTimelineActions.flipSave({ code: postCode }));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callPostLike = (postCode) => {
    const url = myConfig.hostName + '/posts/like-unlike/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'post_code': postCode });
    const successHandler = (data) => postTimelineActions.updateLike({ data: data, code: postCode });

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(postTimelineActions.flipLike({ code: postCode }));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(postTimelineActions.flipLike({ code: postCode }));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callDeletePost = (postCode) => {
    const url = myConfig.hostName + `/posts/code/${postCode}/`;
    const method = 'DELETE';
    const sendData = null;
    const successHandler = (data) => dispatch => {
        dispatch(postTimelineActions.updateDeletePost({ postCode: postCode }));
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
export const callDeleteComment = (postCode, commentId, replyId) => {
    const url = myConfig.hostName + `/comments/${commentId}/`;
    const method = 'DELETE';
    const sendData = null;
    const successHandler = (data) => postTimelineActions.updateDeleteComment({ commentId: commentId, replyId: replyId, postCode: postCode });

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = (data) => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export const callCommentLike = ({ postCode, commentId, replyId }) => {
    const url = myConfig.hostName + '/comments/like-unlike/';
    const method = 'PUT';
    const sendData = JSON.stringify({ 'id': replyId ? replyId : commentId });
    const successHandler = (data) => postTimelineActions.updateLikeComment({ data: data, commentId: commentId, replyId: replyId, postCode: postCode });

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(postTimelineActions.flipLikeComment({ commentId: commentId, replyId: replyId, postCode: postCode }));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(postTimelineActions.flipLikeComment({ commentId: commentId, replyId: replyId, postCode: postCode }));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callSendMessage = (message, postCode) => {
    const url = myConfig.hostName + '/comments/';
    const method = 'POST';
    const sendData = JSON.stringify({ post_code: postCode, body: message });
    const successHandler = (data) => postTimelineActions.updateNewComment({ data: data, code: postCode });

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(postTimelineActions.undoNewComment({ code: postCode }));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(postTimelineActions.undoNewComment({ code: postCode }));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetComments = (postCode) => {
    const url = myConfig.hostName + `/comments/post-code/${postCode}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => postTimelineActions.setCommentData({ code: postCode, data: data });

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => postTimelineActions.setGettingComment(true);
    const afterConnected = () => postTimelineActions.setGettingComment(false);
    const afterUnconnected = () => postTimelineActions.setGettingComment(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetNextComment = (postCode, nextUrl) => {
    const url = nextUrl;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => postTimelineActions.setNextCommentData({ code: postCode, data: data });

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => postTimelineActions.setGettingComment(true);
    const afterConnected = () => postTimelineActions.setGettingComment(false);
    const afterUnconnected = () => postTimelineActions.setGettingComment(false);
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callGetReplyComments = (postCode, commentId) => {
    const url = myConfig.hostName + `/comments/reply-comments/${commentId}/`;
    const method = 'GET';
    const sendData = null;
    const successHandler = (data) => postTimelineActions.setReplyComment({ postCode: postCode, commentId: commentId, data: data });

    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);

    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = () => postTimelineActions.setGettingReplyComment({ id: commentId, value: true });
    const afterConnected = () => postTimelineActions.setGettingReplyComment({ id: commentId, value: false });
    const afterUnconnected = () => postTimelineActions.setGettingReplyComment({ id: commentId, value: false });
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callSendReply = (message, postCode, replyTo) => {
    const url = myConfig.hostName + '/comments/';
    const method = 'POST';
    const sendData = JSON.stringify({ post_code: postCode, body: message, reply_to: replyTo });
    const successHandler = (data) => (dispatch) => {
        dispatch(postTimelineActions.updateNewReply({ data: data, code: postCode, commentId: replyTo }));
        // postTimelineActions.callGetReplyComments
    };

    const failHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.getError));
        dispatch(postTimelineActions.undoNewReply({ code: postCode, commentId: replyTo }));
    };

    const exceptHandler = (data) => (dispatch) => {
        dispatch(toastActions.setIsShow(myConfig.serverError));
        dispatch(postTimelineActions.undoNewReply({ code: postCode, commentId: replyTo }));
    }

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}

export const callEditPost = (formData, postCode) => {
    const url = myConfig.hostName + `/posts/code/${postCode}/`;
    const method = 'PUT';
    const sendData = formData;
    const successHandler = (data) => dispatch => {
        dispatch(postTimelineActions.setEditPost({ data: data, postCode: postCode }));
        dispatch(toastActions.setIsShow(myConfig.editedPost));
    };
    const failHandler = (data) => toastActions.setIsShow(myConfig.getError);
    const exceptHandler = () => toastActions.setIsShow(myConfig.serverError);

    const before = null;
    const afterConnected = null;
    const afterUnconnected = null;
    return callApi(url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected);
}
export default postTimeLineSlice;