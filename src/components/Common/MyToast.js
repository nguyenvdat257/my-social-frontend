import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { toastActions } from '../../store/toast-slice';

const MyToast = () => {
  const dispatch = useDispatch()
  const showToast = useSelector(state => state.toast.isShow);
  const message = useSelector(state => state.toast.message);
  useEffect(() => {
    if (showToast) {
      let interval = setInterval(() => {
        dispatch(toastActions.setNotShow())
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [showToast]);
  return (
    <>
      {showToast && <div className='toasts'>
        <div className='toasts-text'>{message}</div>
      </div>}
    </>
  )
}

export default MyToast