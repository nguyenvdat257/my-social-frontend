import React, { useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { postTimelineActions, callCommentLike, callGetReplyComments } from '../../store/post-timeline-slice'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { Row, Col } from 'react-bootstrap'
import MySpinner from '../Common/Spinner'
import { callLikeCommentProfile } from '../../store/profile-actions'
import ProfileListModal from '../Profile/ProfileListModal'
import { getAvatarSrc } from '../../utils/CommonFunction'
import { BsThreeDots } from 'react-icons/bs';
import { optionActions } from '../../store/option-modal-slice'

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

const PostComment = ({ post, comment, isTimeline, isOriginalComment, inputRef }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const showReply = useSelector(state => state.postTimeline.commentProps[comment?.id]?.showReply)
    const gettingReplyComment = useSelector(state => state.postTimeline.commentProps[comment?.id]?.gettingReplyComment)
    const [showLikeProfile, setShowLikeProfile] = useState(false);
    const [shownReply, setShownReply] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const handleClickReply = e => {
        inputRef.current.focus();
        dispatch(postTimelineActions.setMessage({ postCode: post.code, value: '@' + comment.username + ' ' }));
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
        dispatch(postTimelineActions.setShowReply({ id: commentId, value: !showReply }));
        if (!shownReply) {
            dispatch(callGetReplyComments(post.code, commentId));
            setShownReply(true);
        }
    };
    const handleMouseEnter = e => {
        setIsHover(true);
    };
    const handleMouseLeave = e => {
        setIsHover(false);
    };
    const handleClickThreeDot = e => {
        dispatch(optionActions.setName('comment-my'));
        dispatch(optionActions.setProps({
            postCode: post.code,
            commentId: comment.reply_to ? comment.reply_to : comment.id,
            replyId: comment.reply_to ? comment.id : null,
        }));
    }
    return (
        <>
            {
                isTimeline &&
                <Row>
                    <Col xs={11}>
                        <span className='bold-text-small'>{comment.username} </span>
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
                <div className='post-row-comment' style={{ display: 'flex' }} >
                    <img className='avatar avatar-small' src={getAvatarSrc(comment, 'small')} />
                    <div className='name-avatar-margin-medium' style={{ width: '85%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ maxWidth: '90%' }}>
                                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                    <div className='post-row-comment'>
                                        <span className='bold-text-small'>{comment.username} </span>
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
                                        {
                                            isHover && comment.username === user.username &&
                                            <div style={{ marginLeft: '0.6rem' }}>
                                                <BsThreeDots className='pointer-cursor' size={15} onClick={handleClickThreeDot} />
                                            </div>
                                        }
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
                                <PostComment key={index} post={post} comment={replyComment} isTimeline={isTimeline} />
                            ))
                        }

                    </div>
                    {showLikeProfile &&
                        <ProfileListModal title='Likes' showModal={showLikeProfile} setShowModal={setShowLikeProfile}
                            getData={callLikeCommentProfile(comment.id)} />}
                </div>

            }
            {
                isOriginalComment &&
                <div className='post-row-comment' style={{ display: 'flex', marginTop: '1rem' }}>
                    <img className='avatar avatar-small' style={{ marginRight: '1.0rem' }}
                        src={getAvatarSrc(post.profile_info, 'small')} />
                    <div style={{ width: '85%' }}>
                        <div className='post-row-comment'>
                            <span className='bold-text-small'>{post.profile_info.username} </span>
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