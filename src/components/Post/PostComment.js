import React, { useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { postTimelineActions, callCommentLike, callGetReplyComments } from '../../store/post-timeline-slice'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { Row, Col } from 'react-bootstrap'
import { myConfig } from '../../config'
import MySpinner from '../Common/Spinner'
import { callLikeCommentProfile } from '../../store/profile-actions'
import ProfileListModal from '../Profile/ProfileListModal'

const formatDate = (date) => {
    const parts = date.split(' ');
    const part1 = parts[0] === 'an' || parts[0] === 'a' ? '1' : parts[0];
    if (parts[1] === 'few') {
        return 'Just now';
    }
    else if (parts[1] === 'minute') {
        return part1 + ' ' + 'min';
    }
    else if (parts[1] === 'minutes') {
        return part1 + ' ' + 'mins';
    }
    else {
        return part1 + parts[1][0];
    }
};

const PostComment = ({ post, comment, isTimeline, isOriginalComment, inputRef}) => {
    const dispatch = useDispatch();
    const likeCommentProfiles = useSelector(state => state.profileModal.profiles)
    const showReply = useSelector(state => state.postTimeline.commentProps[comment?.id]?.showReply)
    const gettingReplyComment = useSelector(state => state.postTimeline.commentProps[comment?.id]?.gettingReplyComment)
    const [showLikeProfile, setShowLikeProfile] = useState(false);
    const [shownReply, setShownReply] = useState(false);
    const handleClickReply = e => {
        inputRef.current.focus();
        dispatch(postTimelineActions.setMessage({postCode: post.code, value: '@' + comment.username + ' '}));
        if (comment.reply_to === null)
            dispatch(postTimelineActions.setReplyTo(comment.id));
        else
            dispatch(postTimelineActions.setReplyTo(comment.reply_to));
    }
    const handleClickLikeComment = comment => e => {
        const obj = {
            postCode: post.code,
            commentId: comment.reply_to ? comment.reply_to : comment.id,
            replyId: comment.reply_to ? comment.id : null,
        }
        dispatch(postTimelineActions.flipLikeComment(obj))
        dispatch(callCommentLike(obj));
    };
    const handleClickViewLike = e => {
        setShowLikeProfile(true);
    };
    const handleViewReply = commentId => e => {
        dispatch(postTimelineActions.setShowReply({id: commentId, value:!showReply}));
        if (!shownReply) {
            dispatch(callGetReplyComments(post.code, commentId));
            setShownReply(true);
        }
    };
    return (
        <>
            {
                isTimeline &&
                <Row>
                    <Col xs={11}>
                        <span className='post-username'>{comment.username} </span>
                        <span>{comment.body}</span>
                    </Col>
                    <Col xs={{ span: 1, offset: 0 }} >
                        {!comment.is_like && <AiOutlineHeart size='14px' className='post-button' onClick={handleClickLikeComment(comment)} />}
                        {comment.is_like && <AiFillHeart size='14px' className='post-button' onClick={handleClickLikeComment(comment)} style={{ color: 'red' }} />}
                    </Col>
                </Row>
            }
            {
                !isTimeline && !isOriginalComment &&
                <div className='post-row-comment' style={{ display: 'flex' }}>
                    <img className='avatar post-header-avatar' style={{ marginRight: '1.0rem' }}
                        src={comment.avatar.thumbnail ? myConfig.hostName + comment.avatar.thumbnail : myConfig.defaultAvatar} />
                    <div style={{ width: '85%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ maxWidth: '90%' }}>
                                <div className='post-row-comment'>
                                    <span className='post-username'>{comment.username} </span>
                                    <span>{comment.body}</span>
                                </div>
                                <div className={`post-comment-info ${comment.reply_count > 0 ? 'post-row-comment' : ''}`} style={{ display: 'flex' }}>
                                    <div>
                                        {formatDate(moment(comment.created).fromNow())}
                                    </div>
                                    {comment.likes_count > 0 &&
                                        <div className='pointer-cursor' style={{ marginLeft: '0.6rem' }} onClick={handleClickViewLike}>
                                            {`${comment.likes_count} ${comment.likes_count === 1 ? 'like' : 'likes'}`}
                                        </div>
                                    }
                                    <div className='pointer-cursor' style={{ marginLeft: '0.6rem' }} onClick={handleClickReply}>
                                        Reply
                                    </div>
                                </div>
                                {comment.reply_count > 0 &&
                                    <div style={{ display: 'flex' }}>
                                        <div className='post-comment-info pointer-cursor post-row-comment' onClick={handleViewReply(comment.id)}>
                                            ----- {`${!showReply ? `View replies(${comment.reply_count})` : 'Hide replies'}`}
                                        </div>
                                        {
                                            gettingReplyComment && <div style={{ marginLeft: '0.5rem' }}><MySpinner type={'small'} /></div>
                                        }
                                    </div>
                                }

                            </div>
                            <div style={{ width: '5%' }}>
                                {!comment.is_like && <AiOutlineHeart size='14px' className='post-button' onClick={handleClickLikeComment(comment)} />}
                                {comment.is_like && <AiFillHeart size='14px' className='post-button' onClick={handleClickLikeComment(comment)} style={{ color: 'red' }} />}
                            </div>

                        </div>
                        {showReply &&
                            comment.reply_comments?.map((replyComment, index) => (
                                <PostComment key={index} post={post} comment={replyComment} isTimeline={isTimeline}/>
                            ))
                        }

                    </div>
                    {showLikeProfile &&
                        <ProfileListModal showModal={showLikeProfile} setShowModal={setShowLikeProfile}
                            getData={callLikeCommentProfile(comment.id)} profiles={likeCommentProfiles} />}
                </div>

            }
            {
                isOriginalComment &&
                <div className='post-row-comment' style={{ display: 'flex' }}>
                    <img className='avatar post-header-avatar' style={{ marginRight: '1.0rem' }}
                        src={post.profile_info.avatar.thumbnail ? myConfig.hostName + post.profile_info.avatar.thumbnail : myConfig.defaultAvatar} />
                    <div style={{ width: '85%' }}>
                        <div className='post-row-comment'>
                            <span className='post-username'>{post.profile_info.username} </span>
                            <span>{post.body}</span>
                        </div>
                        <div className='post-comment-info post-row-comment' style={{ display: 'flex' }}>
                            <div>
                                {formatDate(moment(post.created).fromNow())}
                            </div>
                        </div>
                    </div>
                </div>

            }
        </>
    )
}

export default PostComment