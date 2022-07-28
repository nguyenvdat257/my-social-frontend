import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';

const MySpinner = ({ type }) => {
  return (
    <>
      {type === 'small' &&
        <Spinner style={{ width: '1rem', height: '1rem' }} animation="border" role="status" />}
      {!(type === 'small') &&
        <Spinner className='spinner' animation="border" role="status" />}
    </>
  )
}

export default MySpinner