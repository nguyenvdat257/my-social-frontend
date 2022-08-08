import React from 'react'
import OptionModal from '../Common/OptionModal';
import ConfirmModal from '../Common/ConfirmModal';
import { confirmActions } from '../../store/confirm-modal-slice';
import { optionActions } from '../../store/option-modal-slice';
import { useSelector, useDispatch } from 'react-redux';
import postTimeLineSlice, { callDeleteComment, callDeletePost, postActions, postSuggestActions, postTimelineActions } from '../../store/post-timeline-slice';
import PostEdit from './PostEdit';
import { postEditActions } from '../../store/post-edit-slice';
import { getAvatarSrc } from '../../utils/CommonFunction';
import { callFollow } from '../../store/profile-actions';
import { profileSuggestActions } from '../../store/profile-suggest-slice';
import { profileActions } from '../../store/profile-slice';
import { profilePreviewActions } from '../../store/profile-preview-slice';
const profileAction = profileActions;
const profilePreviewAction = profilePreviewActions;
const profileSuggestAction = profileSuggestActions;
const postTimelineAction = postTimelineActions;
const postAction = postActions;
const postSuggestAction = postSuggestActions;

const SharedModals = () => {
  const dispatch = useDispatch();
  return (
    <>
      {/* Other post option */}
      <OptionModal options={[
        {
          text: 'Unfollow',
          type: 'danger',
          handleFn: (props) => {
            dispatch(optionActions.setName(''));
            dispatch(confirmActions.setProps({
              titleAvatar: getAvatarSrc(props.post.profile_info, 'large'),
              titleDesc: `Unfollow @${props.post.profile_info.username}?`,
              text: 'Unfollow',
              type: 'postTimeline',
              handleProps: {
                username: props.post.profile_info.username,
                props: { postCode: props.post.code }
              }
            }));
            dispatch(confirmActions.setName('unfollow'));
          }
        },
      ]}
        currentName='post-other' />
      {/* Confirm unfollow */}
      <ConfirmModal
        handleFn={(props) => {
          dispatch(callFollow({
            username: props.username,
            props: props.props,
            updateFn: eval(props.type + 'Action.setFollowData')
          }))
          dispatch(optionActions.setName(''));
        }}
        currentName='unfollow' />
      {/* My post option */}
      <OptionModal options={[
        {
          text: 'Delete',
          type: 'danger',
          handleFn: (props) => {
            dispatch(optionActions.setName(''));
            dispatch(confirmActions.setProps({
              titleMain: 'Delete post?',
              titleDesc: 'Are you sure you want to delete this post?',
              text: 'Delete',
              handleProps: { type: props.type, postCode: props.post.code }
            }));
            dispatch(confirmActions.setName('post-delete'));
          }
        },
        {
          text: 'Edit',
          type: 'normal',
          handleFn: (props) => {
            dispatch(postEditActions.setName('post-edit'));
            dispatch(postEditActions.setProps({
              type: props.type,
              post: props.post
            }));
          }
        }]}
        currentName='post-my' />
      {/* Confirm delete */}
      <ConfirmModal
        handleFn={(props) => {
          dispatch(callDeletePost(props.type, props.postCode));
          dispatch(optionActions.setName(''));
        }}
        currentName='post-delete' />
      {/* My post option */}
      <OptionModal options={[
        {
          text: 'Delete',
          type: 'danger',
          handleFn: (props) => {
            dispatch(callDeleteComment(props.type, props.postCode, props.commentId, props.replyId));
            dispatch(optionActions.setName(''));
          }
        },
      ]}
        currentName='comment-my' />
      <PostEdit currentName='post-edit' />
    </>
  )
}

export default SharedModals