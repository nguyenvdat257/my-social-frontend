import React from 'react'
import OptionModal from '../Common/OptionModal';
import ConfirmModal from '../Common/ConfirmModal';
import { confirmActions } from '../../store/confirm-modal-slice';
import { optionActions } from '../../store/option-modal-slice';
import { useSelector, useDispatch } from 'react-redux';
import postTimeLineSlice, { callDeleteComment, callDeletePost, callFollowInPost, postTimelineActions } from '../../store/post-timeline-slice';
import PostEdit from './PostEdit';
import { postEditActions } from '../../store/post-edit-slice';
import { getAvatarSrc } from '../../utils/CommonFunction';
import { callFollow } from '../../store/profile-actions';
import { profileSuggestActions } from '../../store/profile-suggest-slice';

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
              handleProps: {
                username: props.post.profile_info.username,
                props: { postCode: props.post.code }
              }
            }));
            dispatch(confirmActions.setName('post-unfollow'));
          }
        },
      ]}
        currentName='post-other' />
      {/* Confirm unfollow */}
      <ConfirmModal
        handleFn={(props) => {
          dispatch(callFollow({...props, updateFn: postTimelineActions.setFollowData }))
          dispatch(optionActions.setName(''));
        }}
        currentName='post-unfollow' />
      <ConfirmModal
        handleFn={(props) => {
          dispatch(callFollow({...props, updateFn: profileSuggestActions.setFollowData }))
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
              handleProps: {postCode: props.post.code}
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
              post: props.post
            }));
          }
        }]}
        currentName='post-my' />
      {/* Confirm delete */}
      <ConfirmModal
        handleFn={(props) => {
          dispatch(callDeletePost(props.postCode));
          dispatch(optionActions.setName(''));
        }}
        currentName='post-delete' />
      {/* My post option */}
      <OptionModal options={[
        {
          text: 'Delete',
          type: 'danger',
          handleFn: (props) => {
            dispatch(callDeleteComment(props.postCode, props.commentId, props.replyId));
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