import React, { useEffect, useState } from 'react'
import { Form, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { privacyActions } from '../store/privacy-slice'
import { getData, submitData } from '../store/privacy-slice'
import MyToast from './MyToast'
import MySpinner from './Spinner'

const Privacy = () => {
  const dispatch = useDispatch()
  const accountType = useSelector(state => state.privacy.accountType)
  const showActivity = useSelector(state => state.privacy.showActivity)
  const [selectedItem, setSelectedItem] = useState('accountType')
  const gettingData = useSelector(state => state.privacy.gettingData)
  const sendingData = useSelector(state => state.privacy.sendingData)
  const handleChangeAccountType = e => {
    const newAccountType = accountType === 'PU' ? 'PR' : 'PU';
    dispatch(privacyActions.setPrevAccountType());
    dispatch(privacyActions.setAccountType(newAccountType));
    setSelectedItem('accountType');
    dispatch(submitData(JSON.stringify({ 'account_type': newAccountType })));
    console.log(accountType)
  };
  const handleChangeShowActivity = e => {
    dispatch(privacyActions.setPrevShowActivity());
    dispatch(privacyActions.setShowActivity(!showActivity));
    setSelectedItem('showActivity');
    dispatch(submitData(JSON.stringify({ 'show_activity': !showActivity })));
  };
  useEffect(() => {
    dispatch(getData());
  }, []);
  if (gettingData)
    return (
      <>
        <div className="col-6" style={{ height: '90%', padding: 0, position: 'relative' }} >
          <MySpinner />
        </div>
        <MyToast />
      </>
    )
  else
    return (
      <>
        <div className="col-6" style={{ height: '100%', padding: 0 }} >
          <Card style={{ height: '90%' }}>
            <Card.Body className='p-5'>
              <div className='privacy-title'>Account Privacy</div>
              <div className={`mt-4 privacy-check ${sendingData && selectedItem === 'accountType' ? 'privacy-disabled' : ''}`}>
                <Form.Check type='checkbox'>
                  <Form.Check.Label>Private Account</Form.Check.Label>
                  <Form.Check.Input disabled={sendingData && selectedItem === 'accountType'} type='checkbox' checked={accountType === 'PU'} onChange={handleChangeAccountType} />
                </Form.Check>
              </div>
              <div className={`pb-3 privacy-note ${sendingData && selectedItem === 'accountType' ? 'privacy-disabled' : ''}`} style={{ 'borderBottom': '1px ridge' }}>When your account is private, only people you approve can see
                your photos and videos. Your existing followers won't be affected.</div>

              <div className='mt-3 privacy-title'>Activity Status</div>
              <div className={`mt-4 privacy-check ${sendingData && selectedItem === 'showActivity' ? 'privacy-disabled' : ''}`}>
                <Form.Check type='checkbox'>
                  <Form.Check.Label>Show Activity Status</Form.Check.Label>
                  <Form.Check.Input disabled={sendingData && selectedItem === 'showActivity'} type='checkbox' checked={showActivity} onChange={handleChangeShowActivity} />
                </Form.Check>
              </div>
              <div className={`privacy-note ${sendingData && selectedItem === 'showActivity' ? 'privacy-disabled' : ''}`}>Allow accounts you follow and anyone you message to see when you were last active or are currently active. When this is turned off, you won't be able to see the activity
                status of other accounts</div>
            </Card.Body>
          </Card>
        </div>
        <MyToast />
      </>
    )
}

export default Privacy