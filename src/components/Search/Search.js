import React, { useState, useEffect, useRef } from 'react'
import { Card, InputGroup, FormControl } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import { callClearAllSearch, callGetSavedSearch, callSearchProfile, callSearchTag, searchActions } from '../../store/search-slice';
import MySpinner from '../Common/Spinner';
import SearchProfileItem from './SearchProfileItem';
import SearchTagItem from './SearchTagItem';

const Search = () => {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const items = useSelector(state => {
        if (state.search.currentType === 'tag')
            return state.search.tags;
        if (state.search.currentType === 'profile')
            return state.search.profiles;
        return state.search.recentSearches;
    })
    const currentType = useSelector(state => state.search.currentType);
    const recentLoaded = useSelector(state => state.search.recentLoaded);
    const gettingData = useSelector(state => state.search.gettingData);
    const ref = useRef(null);
    const handleFocusSearch = e => {
        setShowSearch(true);
    }
    const handleKeywordChange = e => {
        setKeyword(e.target.value);
    }
    const handleClick = event => {
        const { target } = event
        if (!ref.current?.contains(target)) {
            setShowSearch(false);
        }
    }
    const handleClickClearAll = e => {
        dispatch(callClearAllSearch());
    }
    useEffect(() => {
        if (keyword.length > 1 && keyword.slice(0, 1) === '#') {
            const idx = keyword.search(/[^#]/)
            if (idx != -1) {
                dispatch(callSearchTag(keyword.slice(idx)));
            }
        }
        else if (keyword.length > 0 && keyword.slice(0, 1) != '#') {
            dispatch(callSearchProfile(keyword));
        }
        else if (keyword.length === 0 ) {
            if (!recentLoaded)
                dispatch(callGetSavedSearch());
            dispatch(searchActions.setCurrentType('recent'));
        }
    }, [keyword])

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);
    return (
        <div ref={ref}>
            <InputGroup onFocus={handleFocusSearch}>
                <InputGroup.Text id="basic-addon1"><BsSearch /></InputGroup.Text>
                <FormControl
                    value={keyword}
                    placeholder="Search"
                    type="search"
                    aria-label="Search"
                    onChange={handleKeywordChange}
                />
            </InputGroup>
            {showSearch &&
                <div style={{ position: 'absolute', left: '-2.5rem', top: '3rem' }}>
                    <Card style={{ position: 'relative', width: '25rem', height: '25rem', padding: '0.5rem' }}>
                        {gettingData &&
                            <MySpinner />
                        }
                        {!gettingData &&
                            <>
                                {
                                    currentType === 'recent' &&
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
                                        <div className='bold-text-small'>Recent</div>
                                        <div className='bold-text-small pointer-cursor' style={{ color: 'dodgerblue' }} onClick={handleClickClearAll}>
                                            Clear all
                                        </div>
                                    </div>
                                }
                                {
                                    items.map((item, index) => {
                                        if (currentType === 'recent') {
                                            if (item.type === 'profile')
                                                return <SearchProfileItem key={index} searchId={item.searchId} profile={item.data} />
                                            else
                                                return <SearchTagItem key={index} searchId={item.searchId} tag={item.data} />
                                        }
                                        else if (currentType === 'profile') {
                                            return <SearchProfileItem key={index} profile={item} />
                                        }
                                        else if (currentType === 'tag') {
                                            return <SearchTagItem key={index} tag={item} />
                                        }
                                    })

                                }
                            </>
                        }
                    </Card>
                </div>}

        </div>
    )
}

export default Search