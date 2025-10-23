import React, { useEffect, useState } from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message, Spin } from 'antd';
import PlaneBanner from '../components/planeBanner';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { translate } = useLanguage();

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.termsAndConditions();
      const data = handleApiResponse(response);

      if (data?.data) {
        setContentData(data.data);
      } else {
        message.error('No content found');
      }
    } catch (error) {
      if (error?.message === 'Network Error') {
        messageApi.open({
          type: 'error',
          content: translate('filters.OFFLINE_ERROR'),
        });
      } else {
        const errorData = handleApiError(error);
        message.error(errorData.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: 'short', // e.g., Wed
      day: '2-digit',   // e.g., 15
      month: 'long',    // e.g., October
      year: 'numeric',  // e.g., 2025
      hour: '2-digit',  // e.g., 10
      minute: '2-digit',// e.g., 38
      hour12: true,     // AM/PM format
    });
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
        {contextHolder}
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

            {/* Last Updated with date & time */}
            {contentData?.privacy_policy?.[0]?.updated_at && (
              <p style={{ color: '#999', fontSize: '14px', marginTop: '12px' }}>
                Last Updated: {formatDateTime(contentData.privacy_policy[0].updated_at)}
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PrivacyPolicy;
