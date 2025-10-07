import React, { useState, useEffect } from 'react';
import { Button, Tabs, Modal, Input, Radio } from 'antd';
import SubscriptionCard from './SubscriptionCard';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';


const plansData = {
  Individual:[],
  Dealer: [],
};

const EmptyState = () => (
  <div style={{ textAlign: 'center', padding: 40 }}>
    <h3>No Plans Available</h3>
    <p>Please check back later for subscription plans.</p>
  </div>
);

// Helper function to map plan data - extracted to reduce component complexity
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
      price: `IQD ${item.price}`,
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
    is_subscribed: item.is_subscribed || 0,
  }));

// Helper function to map package details - extracted to reduce component complexity
const mapPackageDetailsData = (data, prevPlan) => ({
  ...prevPlan,
  ...data,
  id: data.id || prevPlan.id,
  title: data.name || data.title || prevPlan.title,
  price: parseFloat(data.price) || prevPlan.price,
  duration: `${data.duration_days || data.duration} Days`,
  details: {
    price: `IQD ${data.price}`,
    priceModel: data.price_model || 'Per Car',
    postsAllowed: data.listing_limit || data.posts_allowed,
    photosAllowed: data.photo_limit || data.photos_allowed || 10,
    videosAllowed: data.video_limit || data.videos_allowed || '-',
    postDuration: `${data.duration_days || data.duration} Days`,
    featured: data.featured || '-',
    banner: data.banner || '-',
    analytics: data.analytics || '-',
    additionalCar: data.additional_car || '-',
    emailNewsletter: data.email_newsletter || '-',
    sponsoredContent: data.sponsored_content || '-',
  },
  highlight: data.highlight || false,
  current: data.current || false,
  is_subscribed: data.is_subscribed || 0,
});

// Cancel confirmation step component - extracted to reduce component complexity
const CancelConfirmStepComponent = ({ onNo, onYes }) => (
  <>
    <div style={{ fontWeight: 600, fontSize: 18, textAlign: 'center', marginBottom: 24 }}>
      Are You Sure You Want To Cancel This Subscription?
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
      <Button onClick={onNo} style={{ width: 100 }}>No</Button>
      <Button type="primary" danger style={{ width: 100 }} onClick={onYes}>Yes</Button>
    </div>
  </>
);

// Phone number step component - extracted to reduce component complexity
const PhoneNumberStepComponent = ({ phone, onPhoneChange, onContinue }) => (
  <>
    <div style={{ fontWeight: 600, fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
      Enter Number To Cancel Subscriptions
    </div>
    <div style={{ fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
      Enter Your New Phone Number to change
    </div>
    <Input
      addonBefore={<span style={{ fontWeight: 600 }}>+961</span>}
      placeholder="71 000 000"
      value={phone}
      onChange={onPhoneChange}
      style={{ marginBottom: 16, width: '100%' }}
      maxLength={8}
    />
    <Button type="primary" style={{ width: '100%' }} onClick={onContinue}>
      Continue
    </Button>
  </>
);

// OTP step component - extracted to reduce component complexity
const OtpStepComponent = ({ otp, onOtpChange, otpTimer, onContinue }) => (
  <>
    <div style={{ fontWeight: 600, fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
      Enter OTP Sent To Cancel Subscriptions
    </div>
    <div style={{ fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
      Enter Your New Phone Number to change
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
      {otp.map((digit, idx) => (
        <Input
          key={idx}
          value={digit}
          onChange={(e) => onOtpChange(e, idx)}
          id={`otp-input-${idx}`}
          style={{ width: 40, height: 40, textAlign: 'center', fontSize: 20 }}
          maxLength={1}
        />
      ))}
    </div>
    <div style={{ textAlign: 'center', marginBottom: 16, color: '#039be5' }}>
      Resend in {otpTimer}s
    </div>
    <Button type="primary" style={{ width: '100%' }} onClick={onContinue}>
      Continue
    </Button>
  </>
);

// Done step component - extracted to reduce component complexity
const DoneStepComponent = ({ onDone }) => (
  <>
    <div style={{ fontWeight: 600, fontSize: 20, textAlign: 'center', marginBottom: 24 }}>
      Subscription Cancelled
    </div>
    <Button type="primary" style={{ width: '100%' }} onClick={onDone}>
      Done
    </Button>
  </>
);

const SubscriptionDetails = ({ plan, onBack, onCancel, onSubscribe, isCurrent, loading }) => (
  <div className="subscription-details-main">
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginRight: 8 }} />
      <div className="subscriptions-header" style={{ marginBottom: 0 }}>Subcriptions</div>
    </div>
    <div className="subscription-details-card" style={{ background: isCurrent ? '#0091ea' : '#e3e8ef', borderRadius: 12, padding: 24, color: isCurrent ? '#fff' : '#222', marginBottom: 24 }}>
      {isCurrent && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <div style={{ background: '#ffa726', color: '#fff', borderRadius: 6, padding: '2px 12px', display: 'inline-block' }}>Current</div>
        </div>
      )}
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>{plan.title}</div>
      <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
        IQD  {plan.price} <span style={{ fontSize: 16, fontWeight: 400, color: isCurrent ? '#e3e8ef' : '#888' }}>{plan.duration}</span>
      </div>
    </div>
    <table style={{ width: '100%', background: '#fff', borderRadius: 12, marginBottom: 24 }}>
      <tbody>
        <tr><td>Price</td><td style={{ textAlign: 'right' }}>{plan.details.price}</td></tr>
        <tr><td>Price Model</td><td style={{ textAlign: 'right' }}>{plan.details.priceModel}</td></tr>
        <tr><td>Posts Allowed</td><td style={{ textAlign: 'right' }}>{plan.details.postsAllowed}</td></tr>
        <tr><td>Photos Allowed</td><td style={{ textAlign: 'right' }}>{plan.details.photosAllowed}</td></tr>
        <tr><td>Videos Allowed</td><td style={{ textAlign: 'right' }}>{plan.details.videosAllowed}</td></tr>
        <tr><td>Post Duration</td><td style={{ textAlign: 'right' }}>{plan.details.postDuration}</td></tr>
        <tr><td>Featured</td><td style={{ textAlign: 'right' }}>{plan.details.featured}</td></tr>
        <tr><td>Banner</td><td style={{ textAlign: 'right' }}>{plan.details.banner}</td></tr>
        <tr><td>Analytics</td><td style={{ textAlign: 'right' }}>{plan.details.analytics}</td></tr>
        <tr><td>Additional Car</td><td style={{ textAlign: 'right' }}>{plan.details.additionalCar}</td></tr>
        <tr><td>Email Newsletter</td><td style={{ textAlign: 'right' }}>{plan.details.emailNewsletter}</td></tr>
        <tr><td>Sponsored content ( Articles or Review )</td><td style={{ textAlign: 'right' }}>{plan.details.sponsoredContent}</td></tr>
      </tbody>
    </table>
    {isCurrent ? (
      // <Button type="primary" danger style={{ width: 220, borderRadius: 24 }} onClick={onCancel}>Cancel Subscription</Button>
     <div></div>
    ) : (
      <Button type="primary" style={{ width: 220, borderRadius: 24 }} onClick={() => onSubscribe(plan.id)} loading={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    )}
  </div>
);

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState('Individual');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cancelStep, setCancelStep] = useState(null); // null | 'number' | 'otp' | 'done' | 'confirm'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [loading, setLoading] = useState(false); // loading spinner
  const [messageApi, contextHolder] = message.useMessage();

  const [value, setValue] = useState('Individual');

  


  const [newplansData, setNewPlansData] = useState(plansData);

  // Subscribe functionality
  const handleSubscribe = async (packageId) => {
    try {
      setLoading(true);
      
      // Generate payment merchant and payment_id (you may want to integrate with actual payment gateway)
      const paymentMerchant = 'FIjbkcjasgc,agc,B'; // This should come from payment gateway
      const paymentId = `adskfjsahdfk-sadfsajdfjasdhkfdfghjkl;lkjh-${Date.now()}`; // This should come from payment gateway
      
      const subscriptionData = {
        package_id: packageId,
        payment_merchant: paymentMerchant,
        payment_id: paymentId,
        payment_status: 'success'
      };

      const response = await userAPI.subscribe(subscriptionData);
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Show message from API response
        messageApi.success(result.message || 'Subscription successful!');
        // Optionally refresh the plans data to show updated subscription status
        fetchPackageDetails(selectedPlan?.id);
      } else {
        fetchPackageDetails(selectedPlan?.id);
                messageApi.success(result.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.error(errorData.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch package details when a card is selected
  const fetchPackageDetails = async (packageId) => {
    try {
      setLoading(true);
      const response = await userAPI.getPackageDetails(packageId);
      const result = handleApiResponse(response);
      
      if (result.success) {
        setSelectedPlan(prevPlan => mapPackageDetailsData(result.data, prevPlan));
      } else {
        messageApi.error(result.message || 'Failed to fetch package details.');
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.error(errorData.message || 'Failed to fetch package details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP timer effect
  React.useEffect(() => {
    let timer;
    if (cancelStep === 'otp' && otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cancelStep, otpTimer]);

  const plans = newplansData[activeTab]; // ✅ uses fetched plans

  // Helper: Handle OTP input change
  const handleOtpInputChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) {
      document.getElementById(`otp-input-${idx + 1}`).focus();
    }
  };

  // Helper: Handle cancel done
  const handleCancelDone = () => {
    setCancelStep(null);
    setSelectedPlan(null);
  };

  // Modal content for cancel flow - using extracted components
  const renderCancelModal = () => {
    const modalSteps = {
      confirm: <CancelConfirmStepComponent onNo={() => setCancelStep(null)} onYes={() => setCancelStep('number')} />,
      number: <PhoneNumberStepComponent phone={phone} onPhoneChange={(e) => setPhone(e.target.value)} onContinue={() => setCancelStep('otp')} />,
      otp: <OtpStepComponent otp={otp} onOtpChange={handleOtpInputChange} otpTimer={otpTimer} onContinue={() => setCancelStep('done')} />,
      done: <DoneStepComponent onDone={handleCancelDone} />,
    };
    
    return modalSteps[cancelStep] || null;
  };

  // API CALL

 useEffect(() => {
 

   fetchPlans();
 }, []);
  const fetchPlans = async () => {
     try {
       const res = await userAPI.getsubscriptions(); 
       const result = res.data; 

       if (result.success) {
         const { individual_packages = [], dealer_packages = [] } = result.data;

         setNewPlansData({
           Individual: mapPlanData(individual_packages),
           Dealer: mapPlanData(dealer_packages),
         });
       }
     } catch (error) {
       const errorData = handleApiError(error);
       messageApi.error(errorData.message || 'Failed to fetch subscription plans. Please try again.');
     }
   };
             
  return (
    <div className="subscriptions-main">
      {contextHolder}
      {!selectedPlan ? (
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
              value={activeTab} // activeTab controls selected radio
              style={{
                display: 'flex', // buttons side by side
                gap: '1px', // spacing
              }}
            >
              <Radio.Button
                value='Individual'
                className="custom-radio-button"
                style={{
                  // width: '10%',
                  textAlign: 'center',
                  marginRight: '10px',
                  borderRadius: '4px',
                  color: activeTab === 'Individual' ? '#D67900' : '#000',
                  fontSize: activeTab === 'Individual' ? '14px' : '14px', // You can simplify this, both are 14px
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
                value='Dealer'
                className="custom-radio-button"
                style={{
                  // width: '7%',
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
            {plans.length === 0 ? (
              <EmptyState />
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedPlan(plan);
                    fetchPackageDetails(plan.id);
                  }}
                >
                  <SubscriptionCard {...plan} />
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <SubscriptionDetails
          plan={selectedPlan}
          isCurrent={selectedPlan.is_subscribed === 1}
          onBack={() => setSelectedPlan(null)}
          onCancel={() => setCancelStep('confirm')}
          onSubscribe={handleSubscribe}
          loading={loading}
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