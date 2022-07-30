import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BsEmojiSmile } from 'react-icons/bs'
import Picker from 'emoji-picker-react';
import { Form } from 'react-bootstrap'
import MyAvatar from '../Common/MyAvatar';

const PostForm = ({message, setMessage}) => {
    const user = useSelector(state => state.auth.user);
    const inputRef = useRef(null);
    const smileFaceRef = useRef(null);
    const emojiRef = useRef(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const handleChangeMessage = e => {
        if (e.target.value.length <= 2000)
            setMessage(e.target.value);
    }
    const handleClickEmoji = (event, emojiObject) => {
        const cursor = inputRef.current.selectionStart;
        const text = message.slice(0, cursor) + emojiObject.emoji + message.slice(cursor);
        setMessage(text);
        const newCursor = cursor + emojiObject.emoji.length
        setTimeout(() => {
            inputRef.current.setSelectionRange(newCursor, newCursor);
            inputRef.current.focus();
        }, 10);
        setShowEmoji(false);
        // if (event.target === event.currentTarget) {
        //     setShowEmoji(false);
        // }
    };
    const handleClickSmileFace = e => {
        setShowEmoji(!showEmoji);
    };
    const handleClick = event => {
        const { target } = event
        if (!smileFaceRef.current?.contains(target) && !emojiRef.current?.contains(target)) {
            setShowEmoji(false);
        }
    }
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);
    return (
        <>
            <div style={{ height: '30rem', width: '20rem', padding: '1rem' }}>
                <div style={{ display: 'flex', marginBottom: '1rem' }}>
                    <MyAvatar className='avatar post-header-avatar' />
                    <div className='post-header-username post-username'>
                        {user.username}
                    </div>
                </div>
                <Form>
                    <Form.Control ref={inputRef} value={message} className='shadow-none' as="textarea" rows='9'
                        style={{ border: '0', padding: 0, resize: 'none', overflow: 'auto' }}
                        onChange={handleChangeMessage} placeholder="Write a caption..." />
                </Form>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <div ref={smileFaceRef}>
                            <BsEmojiSmile className='pointer-cursor' size='22px' onClick={handleClickSmileFace} />
                        </div>
                        {
                            showEmoji &&
                            <div ref={emojiRef} style={{ position: 'absolute', top: '30px', left: '-0.7rem', zIndex: '5' }}>
                                <Picker onEmojiClick={handleClickEmoji} style={{ height: '10rem' }} />
                            </div>
                        }
                    </div>
                    <div className='fade-text smaller-text'>
                        {`${message.length}/2000`}
                    </div>

                </div>
            </div>
        </>
    )
}

export default PostForm