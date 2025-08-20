/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Input, Radio } from 'antd';
import SubscriptionCard from './SubscriptionCard';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
import { userAPI } from '../services/api';

const plansData = {
  Individual: [
    {
      id: 1,
      title: 'Freemium +',
      price: 5,
      duration: '15 Days',
      features: ['Price Model Per Car', '1 Posts Allowed', '10 Photos Allowed'],
      details: {
        price: 'USD 5',
        priceModel: 'Per Car',
        postsAllowed: 1,
        photosAllowed: 10,
        videosAllowed: '-',
        postDuration: '15 Days',
        featured: '-',
        banner: '-',
        analytics: '-',
        additionalCar: '-',
        emailNewsletter: '-',
        sponsoredContent: '-',
      },
      highlight: true,
      current: true,
    },
    {
      id: 2,
      title: 'Freemium',
      price: 5,
      duration: '15 Days',
      features: ['Price Model Per Car', '1 Posts Allowed', '10 Photos Allowed'],
      details: {
        price: 'USD 5',
        priceModel: 'Per Car',
        postsAllowed: 1,
        photosAllowed: 10,
        videosAllowed: '-',
        postDuration: '15 Days',
        featured: '-',
        banner: '-',
        analytics: '-',
        additionalCar: '-',
        emailNewsletter: '-',
        sponsoredContent: '-',
      },
      highlight: false,
      current: false,
    },
  ],
  Dealer: [],
};

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
        Subcriptions
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
    <table
      style={{
        width: '100%',
        background: '#fff',
        borderRadius: 12,
        marginBottom: 24,
      }}
    >
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Item</th>
          <th style={{ textAlign: 'right' }}>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Price</td>
          <td style={{ textAlign: 'right' }}>{plan.details.price}</td>
        </tr>
        <tr>
          <td>Price Model</td>
          <td style={{ textAlign: 'right' }}>{plan.details.priceModel}</td>
        </tr>
        <tr>
          <td>Posts Allowed</td>
          <td style={{ textAlign: 'right' }}>{plan.details.postsAllowed}</td>
        </tr>
        <tr>
          <td>Photos Allowed</td>
          <td style={{ textAlign: 'right' }}>{plan.details.photosAllowed}</td>
        </tr>
        <tr>
          <td>Videos Allowed</td>
          <td style={{ textAlign: 'right' }}>{plan.details.videosAllowed}</td>
        </tr>
        <tr>
          <td>Post Duration</td>
          <td style={{ textAlign: 'right' }}>{plan.details.postDuration}</td>
        </tr>
        <tr>
          <td>Featured</td>
          <td style={{ textAlign: 'right' }}>{plan.details.featured}</td>
        </tr>
        <tr>
          <td>Banner</td>
          <td style={{ textAlign: 'right' }}>{plan.details.banner}</td>
        </tr>
        <tr>
          <td>Analytics</td>
          <td style={{ textAlign: 'right' }}>{plan.details.analytics}</td>
        </tr>
        <tr>
          <td>Additional Car</td>
          <td style={{ textAlign: 'right' }}>{plan.details.additionalCar}</td>
        </tr>
        <tr>
          <td>Email Newsletter</td>
          <td style={{ textAlign: 'right' }}>{plan.details.emailNewsletter}</td>
        </tr>
        <tr>
          <td>Sponsored content ( Articles or Review )</td>
          <td style={{ textAlign: 'right' }}>
            {plan.details.sponsoredContent}
          </td>
        </tr>
      </tbody>
    </table>
    {isCurrent && (
      <Button
        type="primary"
        danger
        style={{ width: 220, borderRadius: 24 }}
        onClick={onCancel}
      >
        Cancel Subscription
      </Button>
    )}
    {!isCurrent && (
      <Button type="primary" style={{ width: 220, borderRadius: 24 }}>
        Subscribe
      </Button>
    )}
  </div>
);

SubscriptionDetails.propTypes = {
  plan: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    duration: PropTypes.string.isRequired,
    details: PropTypes.shape({
      price: PropTypes.string.isRequired,
      priceModel: PropTypes.string.isRequired,
      postsAllowed: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      photosAllowed: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      videosAllowed: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      postDuration: PropTypes.string.isRequired,
      featured: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
        .isRequired,
      banner: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
      analytics: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
        .isRequired,
      additionalCar: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      emailNewsletter: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]).isRequired,
      sponsoredContent: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]).isRequired,
    }).isRequired,
    current: PropTypes.bool,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCurrent: PropTypes.bool.isRequired,
};

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState('Individual');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cancelStep, setCancelStep] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState([
    { id: 'otp-0', value: '' },
    { id: 'otp-1', value: '' },
    { id: 'otp-2', value: '' },
    { id: 'otp-3', value: '' },
  ]);
  const [otpTimer, setOtpTimer] = useState(60);

  const [newplansData, setNewPlansData] = useState(plansData);

  React.useEffect(() => {
    let timer;
    if (cancelStep === 'otp' && otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cancelStep, otpTimer]);

  const plans = newplansData[activeTab];

  const renderCancelModal = () => {
    if (cancelStep === 'confirm') {
      return (
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
            <Button onClick={() => setCancelStep(null)} style={{ width: 100 }}>
              No
            </Button>
            <Button
              type="primary"
              danger
              style={{ width: 100 }}
              onClick={() => setCancelStep('number')}
            >
              Yes
            </Button>
          </div>
        </>
      );
    }
    if (cancelStep === 'number') {
      return (
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
          <div style={{ fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
            Enter Your New Phone Number to change
          </div>
          <Input
            addonBefore={<span style={{ fontWeight: 600 }}>+961</span>}
            placeholder="71 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginBottom: 16, width: '100%' }}
            maxLength={8}
          />
          <Button
            type="primary"
            style={{ width: '100%' }}
            onClick={() => setCancelStep('otp')}
          >
            Continue
          </Button>
        </>
      );
    }
    if (cancelStep === 'otp') {
      return (
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
          <div style={{ fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
            Enter Your New Phone Number to change
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
                key={digit.id}
                value={digit.value}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 1);
                  const newOtp = otp.map((d, i) =>
                    i === idx ? { ...d, value: val } : d,
                  );
                  setOtp(newOtp);
                  if (val && idx < newOtp.length - 1) {
                    const nextId = newOtp[idx + 1].id;
                    const nextEl = document.getElementById(nextId);
                    if (nextEl) nextEl.focus();
                  }
                }}
                id={digit.id}
                style={{
                  width: 40,
                  height: 40,
                  textAlign: 'center',
                  fontSize: 20,
                }}
                maxLength={1}
              />
            ))}
          </div>
          <div
            style={{ textAlign: 'center', marginBottom: 16, color: '#039be5' }}
          >
            Resend in {otpTimer}s
          </div>
          <Button
            type="primary"
            style={{ width: '100%' }}
            onClick={() => setCancelStep('done')}
          >
            Continue
          </Button>
        </>
      );
    }
    if (cancelStep === 'done') {
      return (
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
          <Button
            type="primary"
            style={{ width: '100%' }}
            onClick={() => {
              setCancelStep(null);
              setSelectedPlan(null);
            }}
          >
            Done
          </Button>
        </>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await userAPI.getsubscriptions();
        const result = res.data;

        if (result.success) {
          const { individual_packages = [], dealer_packages = [] } =
            result.data;

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

  return (
    <div className="subscriptions-main">
      {!selectedPlan && (
        <>
          <div className="subscriptions-header">Subcriptions</div>
          <div
            className="subscriptions-desc"
            style={{ fontSize: 16, fontWeight: 400, color: '#0A0A0B' }}
          >
            Lorem ipsum dolor sit amet consectetur. Leo vitae tellus turpis
            adipiscing in. Eget in vehicula ut egestas risus sit lacus. Sit et
            ut ac vulputate. Scelerisque euismod phasellus dignissim ut.
          </div>
          <div style={{ marginBottom: 16, marginLeft: 24 }}>
            <Radio.Group
              onChange={(e) => setActiveTab(e.target.value)}
              value={activeTab}
              style={{
                display: 'flex',
                gap: '1px',
              }}
            >
              <Radio.Button
                value="Individual"
                className="custom-radio-button"
                style={{
                  width: '10%',
                  textAlign: 'center',
                  marginRight: '10px',
                  borderRadius: '4px',
                  color: activeTab === 'Individual' ? '#D67900' : '#000',
                  fontSize: '14px',
                  fontWeight: activeTab === 'Individual' ? '700' : '400',
                  borderColor:
                    activeTab === 'Individual' ? '#FFEDD5' : '#ffffff',
                  backgroundColor:
                    activeTab === 'Individual' ? '#FFEDD5' : undefined,
                }}
              >
                Individual
              </Radio.Button>

              <Radio.Button
                value="Dealer"
                className="custom-radio-button"
                style={{
                  width: '7%',
                  textAlign: 'center',
                  borderRadius: '4px',
                  color: activeTab === 'Dealer' ? '#D67900' : '#000',
                  fontSize: '14px',
                  fontWeight: activeTab === 'Dealer' ? '700' : '400',
                  borderLeft: '1px solid #D67900',
                  borderColor: activeTab === 'Dealer' ? '#FFEDD5' : '#ffffff',
                  backgroundColor:
                    activeTab === 'Dealer' ? '#FFEDD5' : undefined,
                }}
              >
                Dealer
              </Radio.Button>
            </Radio.Group>
          </div>
          <div
            className="subscriptions-list"
            style={{ display: 'flex', gap: 24, marginTop: 24 }}
          >
            {plans.length === 0 && <EmptyState />}
            {plans.length > 0 &&
              plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedPlan(plan);
                  }}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <SubscriptionCard {...plan} />
                </div>
              ))}
          </div>
        </>
      )}
      {selectedPlan && (
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
        closeIcon
      >
        {renderCancelModal()}
      </Modal>
    </div>
  );
};

export default Subscriptions;