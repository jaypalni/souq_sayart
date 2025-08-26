import React from 'react';
import { Button, Input, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const ChangePhoneNumber = ({ onBack }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <ArrowLeftOutlined
          onClick={onBack}
          style={{ fontSize: '18px', cursor: 'pointer', marginRight: '10px' }}
        />
        <h3 style={{ margin: 0 }}>Change Phone Number</h3>
      </div>

      <p style={{ marginBottom: '15px' }}>
        Enter Your New Phone Number to change
      </p>

      <Row gutter={10}>
        <Col span={6}>
          <Input value='+961' disabled />
        </Col>
        <Col span={18}>
          <Input placeholder='71 000 000' />
        </Col>
      </Row>

      <Button
        type='primary'
        block
        style={{ marginTop: '20px', height: '40px', borderRadius: '8px' }}
      >
        Continue
      </Button>
    </div>
  );
};

ChangePhoneNumber.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ChangePhoneNumber;
