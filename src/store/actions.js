export const callApi = (url, method, sendData, successHandler, failHandler, exceptHandler, before, afterConnected, afterUnconnected) =>
    async (dispatch, getState) => {
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
            const status = res.status;
            let fetchData = null;
            if (status === 200) {
                fetchData = await res.json();
            } else {
                console.log('feiwoj')
            }
            return [fetchData, status];
        }
        try {  
            const [fetchData, status] = await fetchHandler();  
            if (status === 200) {  
                if (successHandler) dispatch(successHandler(fetchData));
            } else {
                if (failHandler) dispatch(failHandler(fetchData));
            }
            if (afterConnected) dispatch(afterConnected());
        } catch (err) {
            dispatch(exceptHandler())
            if (afterUnconnected) dispatch(afterUnconnected());
        }
    }
