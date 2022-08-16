import React, { useState, useEffect, useRef } from 'react'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { clickActions } from '../../store/click-slice';
import { callGetNextNotifications, callGetNotifications, notificationActions } from '../../store/notification-slice';
import MySpinner from '../Common/Spinner';
import NotificationItem from './NotificationItem';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

const Notification = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notification.notifications);
    const showNoti = useSelector(state => state.notification.showNoti);
    const { todayPos, earlierPos } = useSelector(state => state.notification.separatorPos);
    const showNotiRef = useRef(null);
    const gettingData = useSelector(state => state.notification.gettingData);
    const gettingNextData = useSelector(state => state.notification.gettingNextData);
    const nextUrl = useSelector(state => state.notification.nextUrl);
    const usedNextUrl = useSelector(state => state.notification.usedNextUrl);
    const ref = useRef(null);
    const notiListRef = useRef(null);
    const onScroll = () => {
        if (notiListRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = notiListRef.current;
            console.log(scrollTop + clientHeight - scrollHeight);
            if (scrollTop + clientHeight - scrollHeight > -2) {
                if (nextUrl && !usedNextUrl.includes(nextUrl)) {
                    dispatch(notificationActions.appendUsedNextUrl(nextUrl));
                    dispatch(callGetNextNotifications(nextUrl))
                }
            }
        }
    };
    const handleClick = event => {
        const { target } = event
        if (!ref.current?.contains(target) && showNotiRef?.current) {
            dispatch(notificationActions.setShowNoti(false));
            dispatch(clickActions.setIsClickable(true));
        }
    }
    const handleClickNoti = e => {
        if (!showNoti) {
            dispatch(clickActions.setIsClickable(false));
        } else {
            dispatch(clickActions.setIsClickable(true));
        }
        dispatch(notificationActions.setShowNoti(!showNoti));
    }
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);
    useEffect(() => {
        if (showNoti) {
            dispatch(callGetNotifications());
        } else {
            dispatch(notificationActions.resetData());
        }
        showNotiRef.current = showNoti;
    }, [showNoti])
    return (
        <div ref={ref} style={{ pointerEvents: 'auto' }}>
            <AiOutlineHeart size={26} className='header-item pointer-cursor' style={{ display: !showNoti ? 'initial' : 'none' }} onClick={handleClickNoti} />
            <AiFillHeart size={26} className='header-item pointer-cursor' style={{ display: showNoti ? 'initial' : 'none' }} onClick={handleClickNoti} />
            {showNoti &&
                <>
                    <div style={{ position: 'absolute', right: '-0rem', top: '3rem' }} >
                        <Card ref={notiListRef} style={{ position: 'relative', width: '30rem', height: '22rem', padding: '0.5rem 0.5rem 3rem 0.5rem', overflowY: 'auto' }} onScroll={onScroll}>
                            {gettingData &&
                                <MySpinner />
                            }
                            {!gettingData &&
                                <>
                                    {
                                        notifications.map((item, index) => (
                                            <>
                                                {todayPos === index &&
                                                    <div key={'separator' + index} className='bold-text-small'>Today</div>
                                                }
                                                {earlierPos === index &&
                                                    <div key={'separator' + index} className='bold-text-small'>Earlier</div>
                                                }
                                                <NotificationItem key={index} item={item} />
                                            </>
                                        ))

                                    }
                                </>
                            }
                            {gettingNextData &&
                                <div style={{ position: 'relative', width: '100%', height: '5rem' }}><MySpinner /></div>
                            }
                        </Card>
                    </div>
                </>

            }
        </div>
    )
}

export default Notification