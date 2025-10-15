import React, { useEffect, useState } from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message, Typography, Spin } from 'antd';
import PlaneBanner from '../components/planeBanner';

const { Title } = Typography;

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.termsAndConditions();
      const data1 = handleApiResponse(response);

      if (data1?.data) {
        setContentData(data1.data);
      } else {
        message.error('No content found');
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PlaneBanner />
      <div
        style={{
          maxWidth: 800,
          margin: '40px auto',
          padding: '0 16px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Spin tip="Loading content..." size="large" />
          </div>
        ) : (
          <>
            <div
              style={{
                color: '#555',
                lineHeight: '1.8',
                fontSize: '16px',
              }}
              dangerouslySetInnerHTML={{
                __html:
                  contentData?.privacy_policy?.[0]?.message ||
                  '<p>No content available.</p>',
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default PrivacyPolicy;
