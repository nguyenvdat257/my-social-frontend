import React, { useEffect, useState, useRef } from 'react'
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai'
import { FiSend } from 'react-icons/fi'
import { BsBookmark, BsBookmarkFill, BsEmojiSmile } from 'react-icons/bs'
import moment from 'moment'
import {
    callPostLike, callPostSave, postTimelineActions, callSendMessage,
    callSendReply, postActions, postSuggestActions, postUserActions
} from '../../store/post-timeline-slice'
import { useDispatch, useSelector } from 'react-redux'
import ProfileListModal from '../Profile/ProfileListModal'
import { callLikePostProfile } from '../../store/profile-actions'
import { Form } from 'react-bootstrap'
import Picker from 'emoji-picker-react';
import PostComments from './PostComments'
const postAction = postActions;
const postTimelineAction = postTimelineActions;
const postSuggestAction = postSuggestActions;
const postUserAction = postUserActions;


const PostDetail = ({ post, isTimeline, inputRef, commentListRef, type }) => {
    const dispatch = useDispatch();
    const actions = eval(type + 'Action');
    const user = useSelector(state => state.auth.user)
    const replyTo = useSelector(state => state[type].replyTo)
    const message = useSelector(state => state[type].postProps[post.code].message)
    const [showBody, setShowBody] = useState(false);
    const [showLikeProfile, setShowLikeProfile] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiRef = useRef(null);
    const smileFaceRef = useRef(null);
    const handleClickEmoji = (event, emojiObject) => {
        const cursor = inputRef.current.selectionStart;
        const text = message.slice(0, cursor) + emojiObject.emoji + message.slice(cursor);
        dispatch(actions.setMessage({ postCode: post.code, value: text }));
        const newCursor = cursor + emojiObject.emoji.length
        setTimeout(() => {
            inputRef.current.setSelectionRange(newCursor, newCursor);
            inputRef.current.focus();
        }, 10);
        if (event.target === event.currentTarget) {
            setShowEmoji(false);
        }
    };
    const handleClickSmileFace = e => {
        setShowEmoji(!showEmoji);
    };
    const handleClickMore = e => {
        setShowBody(true);
    };
    const handleClickMessage = e => {
        dispatch(actions.setShowPostMain({ postCode: post.code, value: true }));
    };
    const handleClickLike = e => {
        dispatch(actions.flipLike({ 'code': post.code }))
        dispatch(callPostLike(type, post.code));
    };
    const handleClickSave = e => {
        dispatch(actions.flipSave({ 'code': post.code }))
        dispatch(callPostSave(type, post.code));
    };
    const handleClickLikeProfile = e => {
        setShowLikeProfile(true);
    };
    const handleChangeMessage = e => {
        dispatch(actions.setMessage({ postCode: post.code, value: e.target.value }));
    };
    const handleKeyDown = e => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
        setShowEmoji(false);
        handleEnterPress(e);
    }
    const handleEnterPress = e => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            onInputCommentSubmit(e);
        }
    };
    const handleClick = event => {
        const { target } = event
        if (!smileFaceRef.current?.contains(target) && !emojiRef.current?.contains(target)) {
            setShowEmoji(false);
        }
    }
    const onInputCommentSubmit = e => {
        if (!message) {
            return;
        }
        dispatch(actions.setMessage({ postCode: post.code, value: '' }));
        inputRef.current.focus();
        if (replyTo === null) {
            dispatch(actions.updateTemporaryNewComment({ code: post.code, message: message, user: user }));
            dispatch(callSendMessage(type, message, post.code));
            commentListRef?.current.scrollTo(0, 0)
        }
        else {
            dispatch(actions.updateTemporaryNewReply({ code: post.code, commentId: replyTo, message: message, user: user }));
            dispatch(callSendReply(type, message, post.code, replyTo));
        }
        dispatch(actions.setReplyTo(null));
        // inputRef.current.style.height = 'inherit';
    };
    const isLongText = (text) => {
        const lines = text.split(/\r?\n/);
        if (lines[0].length < 20 && lines.length == 1)
            return false;
        return true;
    };
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);
    return (
        <>
            <div className='post-control'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {
                        post.is_like &&
                        <AiFillHeart size='25px' className='post-button pointer-cursor' style={{ color: 'red' }} onClick={handleClickLike} />
                    }
                    {
                        !post.is_like &&
                        <AiOutlineHeart size='25px' className='post-button pointer-cursor' onClick={handleClickLike} />
                    }
                    <AiOutlineMessage size='24px' className='post-button post-comment-button pointer-cursor' onClick={handleClickMessage} />
                    <FiSend size='22px' className='post-button post-send-button' />
                </div>
                {post.is_saved && <BsBookmarkFill size='22px' className='post-button pointer-cursor' onClick={handleClickSave} />}
                {!post.is_saved && <BsBookmark size='22px' className='post-button pointer-cursor' onClick={handleClickSave} />}
            </div>
            {post.likes_count > 0 && // Like count
                <div className='post-row bold-text-small'>
                    <span className='pointer-cursor' onClick={handleClickLikeProfile}>{`${post.likes_count} ${post.likes_count > 1 ? 'likes' : 'like'}`}</span>
                </div>}
            {post.likes_count === 0 &&
                <div className='post-row '>
                    <span>Be the first to </span><span className='bold-text-small pointer-cursor' onClick={handleClickLike}>like this</span>
                </div>
            }
            <div className='post-row'>
                {// Post content
                    isTimeline &&
                    <div className='post-content'>
                        {
                            (!isLongText(post.body) || showBody) &&
                            <>
                                <span className='bold-text-small' >{post.profile_info.username} </span>
                                <span>{post.body}</span>
                            </>
                        }
                        {
                            (isLongText(post.body) && !showBody) &&
                            <>
                                <span className='bold-text-small' >{post.profile_info.username} </span>
                                <span>{post.body.slice(0, 20)} ... </span>
                                <span className='fade-text pointer-cursor' onClick={handleClickMore}> more</span>
                            </>
                        }
                    </div>
                }
            </div>
            {isTimeline &&
                <PostComments post={post} isTimeline={isTimeline} type={type} />
            }
            {/* ago text */}
            <div className='post-row fade-text-extra-small'>
                {moment(post.created).fromNow().toUpperCase()}
            </div>
            {/* comment on post */}
            <div className='post-row flex-align-left'>
                <div style={{ position: 'relative' }}>
                    <div ref={smileFaceRef}>
                        <BsEmojiSmile className='pointer-cursor' size='22px' onClick={handleClickSmileFace} />
                    </div>
                    {
                        showEmoji &&
                        <div ref={emojiRef} style={{ position: 'absolute', bottom: '30px', left: '-0.7rem', zIndex: '5' }}>
                            <Picker onEmojiClick={handleClickEmoji} />
                        </div>
                    }
                </div>
                <Form onSubmit={onInputCommentSubmit} style={{ width: '90%' }}>
                    <Form.Control ref={inputRef} value={message} className='shadow-none' as="textarea" rows='1' name='reply' style={{ border: '0', resize: 'none', overflow: 'auto' }} onKeyDown={handleKeyDown} onChange={handleChangeMessage} placeholder="Add a comment..." />
                </Form>
                <div className={`post-button-post pointer-cursor ${message.length > 0 ? '' : 'fade-text'}`}
                    onClick={onInputCommentSubmit}>Post</div>

                {showLikeProfile &&
                    <ProfileListModal title='Likes' showModal={showLikeProfile} setShowModal={setShowLikeProfile}
                        getData={callLikePostProfile(post.code)} />}
            </div>
        </>
    )
}

export default PostDetail