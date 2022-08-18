import React, { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { callGetChat, callGetMoreChat, chatActions } from '../../store/chat-slice';
import {
  MainContainer, ChatContainer, MessageList, Message, MessageInput,
  Sidebar, Search, Conversation, ConversationList, ConversationHeader, AvatarGroup, Avatar, VoiceCallButton,
  VideoCallButton, EllipsisButton, TypingIndicator, MessageSeparator
} from '@chatscope/chat-ui-kit-react';
import { myConfig } from '../../config';
import { getAvatarSrc } from '../../utils/CommonFunction';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../App';
import { Link } from 'react-router-dom';
import moment from 'moment'

const ChatConversation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ws = useContext(SocketContext);
  const user = useSelector(state => state.auth.user);
  const chatroom = useSelector(state => {
    const chatroomFilter = state.chat.chatrooms.filter(chatroom => chatroom.id === state.chat.currentChatroomId)
    if (chatroomFilter.length === 1) {
      return chatroomFilter[0];
    }
    return null
  });
  const gettingChat = useSelector(state => state.chat.gettingChat);
  const nextUrl = useSelector(state => state.chat.chatroomProps[chatroom?.id]?.nextUrl);
  const [messageInputValue, setMessageInputValue] = useState('');
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  let typingTimeout = null;
  let loadingTimeout = null;
  const handleClickAvatar = username => e => {
    navigate(`/profiles/${username}`);
  }
  const typingTimeoutFunc = () => {
    setTyping(false);
    ws.send(JSON.stringify({
      type: 'untyping',
      chatroom_id: chatroom.id,
      username: user.username
    }))
  };
  const loadingTimeoutFunc = () => {
    setLoading(false);
  };
  const handleSendMessage = e => {
    setMessageInputValue('');
    const sendObj = JSON.stringify({
      chatroom_id: chatroom.id,
      username: user.username,
      type: 'message',
      message: messageInputValue
    })
    ws.send(sendObj)
  }
  const onYReachStart = e => {
    if (nextUrl && !loading) {
      setLoading(true);
      loadingTimeout = setTimeout(loadingTimeoutFunc, 2000);
      dispatch(callGetMoreChat(chatroom.id, nextUrl));
    }
  };
  const handleChangeMessage = val => {
    setMessageInputValue(val);
    if (typing === false) {
      setTyping(true);
      ws.send(JSON.stringify({
        type: 'typing',
        chatroom_id: chatroom.id,
        username: user.username
      }))
      typingTimeout = setTimeout(typingTimeoutFunc, 3000);
    } else {
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(typingTimeoutFunc, 3000);
    }
  }
  useEffect(() => {
    if (chatroom && chatroom.chats.length === 0) {
      dispatch(callGetChat(chatroom.id));
    }
  }, [chatroom?.id]);
  useEffect(() => {
    if (chatroom) {
      dispatch(chatActions.updateIsHaveNewChat({ chatroomId: chatroom.id, value: false }));
    }
    if (chatroom?.chats.length > 0 && chatroom.chats[chatroom.chats.length - 1].profile.username != user.username) {
      ws.send(JSON.stringify({
        type: 'seen',
        chatroom_id: chatroom.id,
        username: user.username,
        last_seen_id: chatroom.chats[chatroom.chats.length - 1].id
      }))
    }
  }, [chatroom?.chats.length, chatroom?.id])
  if (chatroom) {
    return (
      <ChatContainer>
        <ConversationHeader>
          <ConversationHeader.Back />

          {chatroom.otherProfiles.length === 1 &&
            <Avatar className='pointer-cursor' src={getAvatarSrc(chatroom.otherProfiles[0], 'small')} name={chatroom.chatroom_name}
              status={chatroom.is_online ? 'available' : null} style={{ width: '2rem', height: '2rem' }}
              onClick={handleClickAvatar(chatroom.otherProfiles[0].username)} />
          }
          {chatroom.otherProfiles.length > 1 &&
            <AvatarGroup size="md" style={{
              width: "10rem",
              height: "2rem"
            }} >
              {
                chatroom.otherProfiles.slice(0, 5).map((profile, index) => (
                  <Avatar key={index} src={getAvatarSrc(profile, 'small')} name={profile.username} />
                ))
              }
            </AvatarGroup>
          }

          <ConversationHeader.Content userName={chatroom.name} info={chatroom.last_active && !chatroom.is_online ? chatroom.last_active : ''} />
          <ConversationHeader.Actions>
            <VoiceCallButton />
            <VideoCallButton />
            <EllipsisButton orientation="vertical" />
          </ConversationHeader.Actions>
        </ConversationHeader>
        <MessageList
          typingIndicator={chatroom.typing.length > 0 ? <TypingIndicator content={chatroom.typing.join(', ') + ` ${chatroom.typing.length > 1 ? 'are' : 'is'} typing`}
          /> : false} loadingMore={gettingChat} onYReachStart={onYReachStart} disableOnYReachWhenNoScroll={true} scrollBehavior='smooth' autoScrollToBottom={false} autoScrollToBottomOnMount={false}>
          {chatroom.chats.map((chat, index) => (
            <>
              {(index === 0 || moment(chatroom.chats[index - 1].created).format('YYYY MM DD') != moment(chat.created).format('YYYY MM DD')) &&
                <MessageSeparator content={moment(chat.created).format('MMMM D YYYY, h:mm a')} />
              }
              <Message key={index} model={{
                message: chat.body ? chat.body : '',
                sentTime: moment(chat.created).fromNow(),
                sender: chat.profile.username,
                direction: chat.profile.username === user.username ? "outgoing" : "incoming",
                position: chat.position === 'last' ? 'single' : chat.position
              }} avatarSpacer={chat.profile.username != user.username &&
                (chat.position === 'first' || chat.position === 'normal')}>

                {chat.type === 'S' &&
                  <Message.CustomContent>
                    <Link to={`/posts/${chat.share_post_code}`}>
                      <img src={myConfig.mediaHost + chat.share_post_img} alt="post image" width={200} />
                    </Link>
                  </Message.CustomContent>
                }
                {chat.type === 'R' &&
                  <Message.CustomContent>
                    {chat.profile.username === user.username ?
                      <div className='fade-text-small'>You replied on story</div> :
                      <div className='fade-text-small'>{`${chat.profile.username} replied on your story`}</div>
                    }

                    <img src={myConfig.mediaHost + chat.reply_story_img} alt="story image" width={200} />
                    <div>{chat.body}</div>
                  </Message.CustomContent>
                }


                {(chat.profile.username != user.username && (chat.position === 'last' || chat.position === 'single')) &&
                  <Avatar className='pointer-cursor' size='sm' src={getAvatarSrc(chat.profile, 'small')} name={chat.profile.username}
                    onClick={handleClickAvatar(chat.profile.username)} />
                }
                {chat.seen_profiles?.length > 0 && chatroom.otherProfiles.length === 1 &&
                  (chat.position === 'last' || chat.position === 'single') &&
                  chat.seen_profiles.filter(profile => profile.username != user.username).length > 0 &&
                  <Message.Footer sentTime='Seen' />
                }
                {chat.seen_profiles?.length > 0 && chatroom.otherProfiles.length > 1 &&
                  (chat.position === 'last' || chat.position === 'single') &&
                  chat.seen_profiles.filter(profile => profile.username != user.username).length > 0 &&
                  <Message.Footer sentTime={'Seen by: ' + chat.seen_profiles.map(profile => profile.username).join(', ')} />
                }
              </Message>
            </>


          ))
          }
        </MessageList>
        <MessageInput placeholder="Type message here" value={messageInputValue} onChange={handleChangeMessage} onSend={handleSendMessage} />
      </ChatContainer>
    )
  }
  if (!chatroom) {
    return <div></div>
  }
}

export default ChatConversation