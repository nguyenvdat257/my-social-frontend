import React from 'react';
import {Row, Col, Spinner} from 'react-bootstrap';

const MySpinner = () => {
  return (
    <Row className="pt-4 form-group">
        <Col md={1} className='offset-5'>
        <Spinner animation="border" role="status" />
        </Col>
    </Row>
  )
}

export default MySpinner