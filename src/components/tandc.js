import React, { useEffect, useState } from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message, Spin } from 'antd';
import PlaneBanner from '../components/planeBanner';
import { useLanguage } from '../contexts/LanguageContext';

const TandC = () => {
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

  const convertEmailsToLinks = (text) => {
    if (!text) return '';
    return text.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      "<a href='mailto:$1' style='color:#008AD5; text-decoration:underline;'>$1</a>"
    );
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: 'short',  // e.g., Wed
      day: '2-digit',    // e.g., 15
      month: 'long',     // e.g., October
      year: 'numeric',   // e.g., 2025
      hour: '2-digit',   // e.g., 10
      minute: '2-digit', // e.g., 38
      hour12: true       // AM/PM
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
            {contentData?.terms_conditions?.length > 0 ? (
              contentData.terms_conditions.map((item) => (
                <div key={item.id} style={{ color: '#555', lineHeight: '1.8', fontSize: '16px', marginBottom: '24px' }}>
                  <div dangerouslySetInnerHTML={{ __html: convertEmailsToLinks(item.message) }} />
                  {item.updated_at && (
                    <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                      Last Updated: {formatDateTime(item.updated_at)}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: '#999', textAlign: 'center' }}>No Terms & Conditions available.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TandC;
