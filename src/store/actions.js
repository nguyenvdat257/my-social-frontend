export const callApi = (url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected) => async (dispatch, getState) => {
    if (before) dispatch(before());
    const fetchConfig = {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + String(getState().auth.token.access),
        },
    }
    if (sendData) fetchConfig['body'] = sendData
    if (!(sendData instanceof FormData)) {
        fetchConfig['headers']['Content-Type'] = 'application/json'
    }

    // if (sendData) fetchConfig['body'] = sendData;
    const fetchHandler = async () => {
        const res = await fetch(url, fetchConfig)
        const fetchData = await res.json();
        const status = res.status;
        return [fetchData, status];
    }
    try {
        const [fetchData, status] = await fetchHandler();
        if (status === 200) {
            dispatch(successHandler(fetchData))
        } else {
            dispatch(failHandler(fetchData))
        }
        if (afterConnected) dispatch(afterConnected());
    } catch (err) {
        dispatch(exceptHandler())
        if (afterUnconnected) dispatch(afterUnconnected());
    }
}
