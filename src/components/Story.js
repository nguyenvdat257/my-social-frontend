import React, { useState, useEffect } from 'react'
import { Card, ProgressBar, Form } from 'react-bootstrap'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { GiPauseButton } from 'react-icons/gi'
import { BsFillPlayFill } from 'react-icons/bs'
import { myConfig } from '../config'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getData } from '../store/story-board-slice'
import MySpinner from './Spinner'
import { storyBoardActions } from '../store/story-board-slice'

const Story = () => {
    const dispatch = useDispatch()
    const [isPause, setIsPause] = useState(false);
    const [isLike, setIsLike] = useState(true);
    const [isFocusInput, setIsFocusInput] = useState(false);
    const { reply, setReply } = useState('');
    const { idx } = useParams();
    const progress = useSelector(state => state.storyBoard.progress);
    const isDataFetched = useSelector(state => state.storyBoard.isDataFetched);
    const isDataReady = useSelector(state => state.storyBoard.isDataReady);
    const isViewAll = useSelector(state => state.storyBoard.isViewAll);
    const isFirstStory = useSelector(state => state.storyBoard.isFirstStory);
    const storyIdx = useSelector(state => state.storyBoard.storyIdx);
    const profile = useSelector(state => state.storyBoard.profile);
    const story = useSelector(state => state.storyBoard.story);
    const stories = useSelector(state => state.storyBoard.stories);
    let interval = null;
    const navigate = useNavigate();

    const handleChangeReply = e => setReply(e.target.value);
    const handleChangePause = e => setIsPause(!isPause);
    const onFormSubmit = e => {
        e.preventDefault();
    };
    const handleOnFocusInput = e => {
        setIsFocusInput(true);
    };
    const handleOnBlurInput = e => {
        setIsFocusInput(false);
    };
    const handleGoBack = e => {
        dispatch(storyBoardActions.decrementStoryIdx())
        dispatch(storyBoardActions.resetProgress())
    };
    const handleGoForward = e => {
        dispatch(storyBoardActions.incrementStoryIdx())
        dispatch(storyBoardActions.resetProgress())
    };
    useEffect(() => {
        if (isViewAll) {
            dispatch(storyBoardActions.resetViewAll())
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
    }, [isDataFetched])
    useEffect(() => {
        interval = setInterval(() => {
            dispatch(storyBoardActions.incrementProgress())
        }, 100);
    }, [isDataReady]);
    useEffect(() => {
        if (progress === 110) {
            if (isViewAll)
                navigate('/')
            else {
                dispatch(storyBoardActions.incrementStoryIdx())
                dispatch(storyBoardActions.resetProgress())
            }
        }
    }, [progress])
    if (!isDataReady)
        return (
            <div className='story-contain' style={{ opacity: isFocusInput ? 0.8 : 0.9 }}>
                <Card className='story-slide'>
                    <MySpinner />
                </Card>
            </div>
        )
    else if (profile === {}) // data ready but empty
        navigate('/')
    else
        return (
            <div className='story-contain' style={{ opacity: isFocusInput ? 0.8 : 0.9 }}>
                <IoIosArrowBack className='story-control-button' onClick={handleGoBack} style={{ visibility: !isFirstStory ? 'visible' : 'hidden' }} />
                <Card className='story-slide'>
                    <div className='story-progress'>
                        <div className='' style={{ display: 'flex' }}>
                            {stories.map((item, index) => {
                                let currentProgress = 0;
                                if (index < storyIdx)
                                    currentProgress = 110;
                                if (index === storyIdx)
                                    currentProgress = progress;
                                return (<ProgressBar key={index} min="0" max="100" className='' now={currentProgress} style={{ width: `${100 / stories.length}%`, height: '3px', marginLeft: '3px' }} />)
                            })}
                        </div>
                        <div className='story-info'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img className='avatar story-avatar' src={profile.avatar.thumbnail_larger ? myConfig.hostName + profile.avatar.thumbnail_larger : myConfig.defaultAvatar} />
                                <div className='story-info-name'>{profile.username}</div>
                                <div className='story-info-ago'>{story['hour_ago']}h</div>
                            </div>
                            <div>
                                {!isPause && <GiPauseButton size='1.4rem' onClick={handleChangePause} />}
                                {isPause && <BsFillPlayFill size='1.6rem' onClick={handleChangePause} />}
                            </div>
                        </div>
                    </div>
                    <img className='story-image' src={myConfig.hostName + story['images'][0]['image']} />
                    <div className='story-reaction'>
                        <div className='story-form'>
                            <Form onSubmit={onFormSubmit} >
                                <Form.Control as="textarea" rows='1' name='reply' style={{ borderRadius: '1.5rem' }} onChange={handleChangeReply} onFocus={handleOnFocusInput} onBlur={handleOnBlurInput} placeholder="Reply to " />
                            </Form>
                            {isFocusInput && <div class='story-send'>Send</div>}
                        </div>
                        {isLike && <AiFillHeart size='1.6rem' style={{ color: 'red' }} />}
                        {!isLike && <AiOutlineHeart size='1.6rem' />}
                    </div>
                </Card>
                <IoIosArrowForward className='story-control-button' onClick={handleGoForward} />
            </div >
        )
}

export default Story