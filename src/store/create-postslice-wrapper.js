import { createSlice } from '@reduxjs/toolkit';

let params = {
    name: '',
    initialState: {
        posts: [],
        nextUrl: null,
        usedNextUrl: [],
        nextCommentUrl: null,
        usedNextCommentUrl: [],
        gettingData: false,
        gettingComment: false,
        postLoaded: false,
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
            state.postLoaded = false;
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
            if (action.payload.results) {
                state.posts = action.payload.results;
                state.nextUrl = action.payload.next;
            }
            else {
                state.posts = action.payload;
            }
            for (const post of state.posts)
                state.postProps[post.code] = { showPostMain: false, message: '' };
            state.gettingData = false;
            state.postLoaded = true;
        },
        setPost(state, action) {
            const postIndex = state.posts.findIndex((post => post.code === action.payload.code));
            state.posts[postIndex] = action.payload;
        },
        appendUsedNextUrl(state, action) {
            state.usedNextUrl.push(action.payload);
        },
        appendUsedNextCommentUrl(state, action) {
            state.usedNextCommentUrl.push(action.payload);
        },
        setNextData(state, action) {
            state.posts = state.posts.concat(action.payload.results);
            state.nextUrl = action.payload.next;
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
            const comment = action.payload.data;
            post.comments.shift();
            post.comments.unshift(comment);
            state.commentProps[comment.id] = { gettingReplyComment: false, showReply: false };
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
            const reply = action.payload.data;
            comment.reply_comments.shift();
            comment.reply_comments.unshift(reply);
            state.commentProps[comment.id] = { gettingReplyComment: false, showReply: true };
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
            state.posts[postIndex].body = action.payload.data.body;
        }
    }
}

export const createPostSlice = (name) => {
    params.name = name;
    const postSlice = createSlice(params);
    return postSlice;
}