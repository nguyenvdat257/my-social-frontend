import React, { useState, useEffect } from 'react'
import { Card, ProgressBar, Form } from 'react-bootstrap'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { GiPauseButton } from 'react-icons/gi'
import { BsFillPlayFill } from 'react-icons/bs'
import { myConfig } from '../../config'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getData, storyLike, storySeen } from '../../store/story-board-slice'
import MySpinner from '../Common/Spinner'
import { storyBoardActions } from '../../store/story-board-slice'

const Story = () => {
    const dispatch = useDispatch()
    const [isFocusInput, setIsFocusInput] = useState(false);
    const { reply, setReply } = useState('');
    const { idx } = useParams();
    const progress = useSelector(state => state.storyBoard.progress);
    const isPause = useSelector(state => state.storyBoard.isPause);
    const isDataFetched = useSelector(state => state.storyBoard.isDataFetched);
    const isDataReady = useSelector(state => state.storyBoard.isDataReady);
    const isViewAll = useSelector(state => state.storyBoard.isViewAll);
    const isFirstStory = useSelector(state => state.storyBoard.isFirstStory);
    const storyIdx = useSelector(state => state.storyBoard.storyIdx);
    const profile = useSelector(state => state.storyBoard.profilesStoriesList?.length > 0 ? state.storyBoard.profilesStoriesList[state.storyBoard.profileIdx][0] : null);
    const story = useSelector(state => state.storyBoard.profilesStoriesList?.length > 0 ? state.storyBoard.profilesStoriesList[state.storyBoard.profileIdx][1][state.storyBoard.storyIdx] : null);
    const stories = useSelector(state => state.storyBoard.profilesStoriesList?.length > 0 ? state.storyBoard.profilesStoriesList[state.storyBoard.profileIdx][1] : null);
    const navigate = useNavigate();

    const handleChangeReply = e => {
        setReply(e.target.value);
    };
    const handleChangePause = e => {
        dispatch(storyBoardActions.setIsPause(!isPause));
    }
    const onFormSubmit = e => {
        e.preventDefault();
    };
    const handleOnFocusInput = e => {
        setIsFocusInput(true);
        dispatch(storyBoardActions.setIsPause(true))
    };
    const handleOnBlurInput = e => {
        setIsFocusInput(false);
        dispatch(storyBoardActions.setIsPause(false))
    };
    const handleGoBack = e => {
        dispatch(storyBoardActions.decrementStoryIdx())
        dispatch(storyBoardActions.resetProgress())
    };
    const handleGoForward = e => {
        dispatch(storyBoardActions.incrementStoryIdx())
        dispatch(storyBoardActions.resetProgress())
    };
    const handleLike = e => {
        dispatch(storyLike(story['id']));
        dispatch(storyBoardActions.setLike(!story['is_like']))
    }
    const handleClickOutside = e => {
        if (e.target === e.currentTarget) {
            navigate('/')
        }
    }
    useEffect(() => {
        if (isViewAll) {
            dispatch(storyBoardActions.resetViewAll());
            navigate('/');
        }
    }, [isViewAll]);
    useEffect(() => {
        if (!isDataFetched) // data not fetched (from refresh)
            dispatch(getData())
        else
            dispatch(storyBoardActions.setIdx(parseInt(idx)));
    }, []);
    useEffect(() => {
        if (isDataFetched)
            dispatch(storyBoardActions.setIdx(parseInt(idx)));
    }, [isDataFetched]);
    useEffect(() => {
        if (!(story === null) && story['is_seen'] === false) {
            dispatch(storySeen(story['id']));
        }
    }, [story]);
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(storyBoardActions.incrementProgress())
        }, 100);
        return () => clearInterval(interval);
    }, [isDataReady]);
    useEffect(() => {
        if (progress === 105) {
            dispatch(storyBoardActions.incrementStoryIdx())
            dispatch(storyBoardActions.resetProgress())
        }
    }, [progress]);
    useEffect(() => {
        if (isPause) {
            dispatch(storyBoardActions.setProgress())
        }
    }, [isPause]);
    if (!isDataReady || profile === null)
        return (
            <div className='story-contain' style={{ opacity: isFocusInput ? 0.8 : 0.9 }}>
                <Card className='story-slide'>
                    <MySpinner />
                </Card>
            </div>
        )
    else
        return (
            <div className='story-contain' style={{ opacity: isFocusInput ? 0.8 : 0.9 }} onClick={handleClickOutside}>
                <IoIosArrowBack className='story-control-button' onClick={handleGoBack} style={{ visibility: !isFirstStory ? 'visible' : 'hidden' }} />
                <Card className='story-slide' style={{ backgroundColor: 'white', borderRadius: '1rem' }}>
                    <div className='story-progress'>
                        <div className='' style={{ display: 'flex' }}>
                            {stories.map((item, index) => {
                                let currentProgress = 0;
                                if (index < storyIdx)
                                    currentProgress = 105;
                                if (index === storyIdx)
                                    currentProgress = progress;
                                return (<ProgressBar key={index} min="0" max="100" className='' now={currentProgress} style={{ width: `${100 / stories.length}%`, height: '3px', marginLeft: '3px' }} />)
                            })}
                        </div>
                        <div className='story-info'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img className='avatar story-avatar' src={profile.avatar.thumbnail_larger ? myConfig.hostName + profile.avatar.thumbnail_larger : myConfig.defaultAvatar} />
                                <div className='story-info-name'>{profile.username}</div>
                                <div className='story-info-ago fade-text'>{story['hour_ago']}h</div>
                            </div>
                            <div>
                                {!isPause && <GiPauseButton className='pointer-cursor' size='1.4rem' onClick={handleChangePause} />}
                                {isPause && <BsFillPlayFill className='pointer-cursor' size='1.6rem' onClick={handleChangePause} />}
                            </div>
                        </div>
                    </div>
                    <img className='story-image' src={myConfig.hostName + story['images'][0]['image']} />
                    <div className='story-reaction'>
                        <div className='story-form'>
                            <Form onSubmit={onFormSubmit} >
                                <Form.Control as="textarea" className='shadow-none' rows='1' name='reply' style={{ borderRadius: '1.5rem', resize: 'none' }} onChange={handleChangeReply} onFocus={handleOnFocusInput} onBlur={handleOnBlurInput} placeholder="Reply to " />
                            </Form>
                            {isFocusInput && <div class='story-send'>Send</div>}
                        </div>
                        {story['is_like'] && <AiFillHeart size='1.6rem' style={{ color: 'red' }} onClick={handleLike} />}
                        {!story['is_like'] && <AiOutlineHeart size='1.6rem' onClick={handleLike} />}
                    </div>
                </Card>
                <IoIosArrowForward className='story-control-button' onClick={handleGoForward} />
            </div >
        )
}

export default Story