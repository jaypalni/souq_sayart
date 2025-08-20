/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Radio, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SubscriptionCard from './SubscriptionCard';
import { handleApiError } from '../utils/apiUtils';
import { userAPI } from '../services/api';


const OTP_LENGTH = 4;
const OTP_TIMEOUT = 60;

const plansData = { Individual: [], Dealer: [] };


const EmptyState = () => (
  <div style={{ textAlign: 'center', padding: 40 }}>
    <h3>No Plans Available</h3>
    <p>Please check back later for subscription plans.</p>
  </div>
);

const SubscriptionDetails = ({ plan, onBack, onCancel, isCurrent }) => (
  <div className="subscription-details-main">
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        style={{ marginRight: 8 }}
      />
      <div className="subscriptions-header" style={{ marginBottom: 0 }}>
        Subscriptions
      </div>
    </div>
    <div
      className="subscription-details-card"
      style={{
        background: isCurrent ? '#0091ea' : '#e3e8ef',
        borderRadius: 12,
        padding: 24,
        color: isCurrent ? '#fff' : '#222',
        marginBottom: 24,
      }}
    >
      {isCurrent && (
        <div
          style={{
            background: '#ffa726',
            color: '#fff',
            borderRadius: 6,
            padding: '2px 12px',
            display: 'inline-block',
            marginBottom: 8,
          }}
        >
          Current
        </div>
      )}
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>
        {plan.title}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
        ${plan.price}{' '}
        <span
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: isCurrent ? '#e3e8ef' : '#888',
          }}
        >
          {plan.duration}
        </span>
      </div>
    </div>

    <PlanDetailsTable details={plan.details} />

    {isCurrent ? (
      <Button
        type="primary"
        danger
        style={{ width: 220, borderRadius: 24 }}
        onClick={onCancel}
      >
        Cancel Subscription
      </Button>
    ) : (
      <Button type="primary" style={{ width: 220, borderRadius: 24 }}>
        Subscribe
      </Button>
    )}
  </div>
);

const PlanDetailsTable = ({ details }) => {
  const rows = Object.entries(details).map(([key, value]) => ({
    label: formatLabel(key),
    value,
  }));

  return (
    <table
      style={{
        width: '100%',
        background: '#fff',
        borderRadius: 12,
        marginBottom: 24,
      }}
    >
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td>{row.label}</td>
            <td style={{ textAlign: 'right' }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const formatLabel = (key) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

const CancelModalContent = ({
  step,
  phone,
  setPhone,
  otp,
  setOtp,
  otpTimer,
  setStep,
  onDone,
}) => {
  if (step === 'confirm') {
    return (
      <ConfirmCancelModal
        onCancel={() => setStep(null)}
        onConfirm={() => setStep('number')}
      />
    );
  }
  if (step === 'number') {
    return (
      <PhoneNumberModal
        phone={phone}
        setPhone={setPhone}
        onNext={() => setStep('otp')}
      />
    );
  }
  if (step === 'otp') {
    return (
      <OtpModal
        otp={otp}
        setOtp={setOtp}
        otpTimer={otpTimer}
        onNext={() => setStep('done')}
      />
    );
  }
  if (step === 'done') {
    return <DoneModal onDone={onDone} />;
  }
  return null;
};

const ConfirmCancelModal = ({ onCancel, onConfirm }) => (
  <>
    <div
      style={{
        fontWeight: 600,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 24,
      }}
    >
      Are You Sure You Want To Cancel This Subscription?
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
      <Button onClick={onCancel} style={{ width: 100 }}>
        No
      </Button>
      <Button type="primary" danger style={{ width: 100 }} onClick={onConfirm}>
        Yes
      </Button>
    </div>
  </>
);

const PhoneNumberModal = ({ phone, setPhone, onNext }) => (
  <>
    <div
      style={{
        fontWeight: 600,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 12,
      }}
    >
      Enter Number To Cancel Subscriptions
    </div>
    <Input
      addonBefore={<span style={{ fontWeight: 600 }}>+961</span>}
      placeholder='71 000 000'
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      style={{ marginBottom: 16, width: '100%' }}
      maxLength={8}
    />
    <Button type="primary" style={{ width: '100%' }} onClick={onNext}>
      Continue
    </Button>
  </>
);

const OtpModal = ({ otp, setOtp, otpTimer, onNext }) => (
  <>
    <div
      style={{
        fontWeight: 600,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 12,
      }}
    >
      Enter OTP Sent To Cancel Subscriptions
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
      }}
    >
      {otp.map((digit, idx) => (
        <Input
          key={idx}
          value={digit}
          onChange={(e) => handleOtpChange(e, idx, otp, setOtp)}
          id={`otp-input-${idx}`}
          style={{ width: 40, height: 40, textAlign: 'center', fontSize: 20 }}
          maxLength={1}
        />
      ))}
    </div>
    <div style={{ textAlign: 'center', marginBottom: 16, color: '#039be5' }}>
      Resend in {otpTimer}s
    </div>
    <Button type="primary" style={{ width: '100%' }} onClick={onNext}>
      Continue
    </Button>
  </>
);

const DoneModal = ({ onDone }) => (
  <>
    <div
      style={{
        fontWeight: 600,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 24,
      }}
    >
      Subscription Cancelled
    </div>
    <Button type="primary" style={{ width: '100%' }} onClick={onDone}>
      Done
    </Button>
  </>
);

const handleOtpChange = (e, idx, otp, setOtp) => {
  const val = e.target.value.replace(/\D/g, '').slice(0, 1);
  const newOtp = [...otp];
  newOtp[idx] = val;
  setOtp(newOtp);
  if (val && idx < OTP_LENGTH - 1) {
    document.getElementById(`otp-input-${idx + 1}`).focus();
  }
};

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState('Individual');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cancelStep, setCancelStep] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [otpTimer, setOtpTimer] = useState(OTP_TIMEOUT);
  const [newplansData, setNewPlansData] = useState(plansData);

  useEffect(() => {
    if (cancelStep !== 'otp' || otpTimer <= 0) return;
    const timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [cancelStep, otpTimer]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await userAPI.getsubscriptions();
        const {
          individual_packages = [],
          dealer_packages = [],
          success,
        } = res.data;

        if (success) {
          setNewPlansData({
            Individual: mapPlanData(individual_packages),
            Dealer: mapPlanData(dealer_packages),
          });
        } else {
          message.error('Failed to fetch plans.');
        }
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchPlans();
  }, []);

  const plans = newplansData[activeTab];

  return (
    <div className="subscriptions-main">
      {!selectedPlan ? (
        <PlanList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          plans={plans}
          onSelect={setSelectedPlan}
        />
      ) : (
        <SubscriptionDetails
          plan={selectedPlan}
          isCurrent={selectedPlan.current}
          onBack={() => setSelectedPlan(null)}
          onCancel={() => setCancelStep('confirm')}
        />
      )}

      <Modal
        open={!!cancelStep}
        onCancel={() => setCancelStep(null)}
        footer={null}
        centered
        width={400}
      >
        <CancelModalContent
          step={cancelStep}
          phone={phone}
          setPhone={setPhone}
          otp={otp}
          setOtp={setOtp}
          otpTimer={otpTimer}
          setStep={setCancelStep}
          onDone={() => {
            setCancelStep(null);
            setSelectedPlan(null);
          }}
        />
      </Modal>
    </div>
  );
};

const PlanList = ({ activeTab, setActiveTab, plans, onSelect }) => (
  <>
    <div className="subscriptions-header">Subscriptions</div>
    <div
      className="subscriptions-desc"
      style={{ fontSize: 16, fontWeight: 400, color: '#0A0A0B' }}
    >
      Lorem ipsum dolor sit amet consectetur. Leo vitae tellus turpis adipiscing
      in...
    </div>
    <div style={{ marginBottom: 16, marginLeft: 24 }}>
      <Radio.Group
        onChange={(e) => setActiveTab(e.target.value)}
        value={activeTab}
        style={{ display: 'flex', gap: '1px' }}
      >
        <Radio.Button value="Individual" className="custom-radio-button">
          Individual
        </Radio.Button>
        <Radio.Button value="Dealer" className="custom-radio-button">
          Dealer
        </Radio.Button>
      </Radio.Group>
    </div>
    <div
      className="subscriptions-list"
      style={{ display: 'flex', gap: 24, marginTop: 24 }}
    >
      {plans.length === 0 ? (
        <EmptyState />
      ) : (
        plans.map((plan) => (
          <div
            key={plan.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(plan)}
          >
            <SubscriptionCard {...plan} />
          </div>
        ))
      )}
    </div>
  </>
);

const mapPlanData = (items) =>
  items.map((item) => ({
    id: item.id,
    title: item.name,
    price: parseFloat(item.price),
    duration: `${item.duration_days} Days`,
    features: [
      'Price Model: Per Car',
      `${item.listing_limit} Posts Allowed`,
      `${item.photo_limit || 10} Photos Allowed`,
    ],
    details: {
      price: `USD ${item.price}`,
      priceModel: 'Per Car',
      postsAllowed: item.listing_limit,
      photosAllowed: item.photo_limit || 10,
      videosAllowed: item.video_limit || '-',
      postDuration: `${item.duration_days} Days`,
      featured: item.featured || '-',
      banner: item.banner || '-',
      analytics: item.analytics || '-',
      additionalCar: item.additional_car || '-',
      emailNewsletter: item.email_newsletter || '-',
      sponsoredContent: item.sponsored_content || '-',
    },
    highlight: item.highlight || false,
    current: item.current || false,
  }));

export default Subscriptions;
