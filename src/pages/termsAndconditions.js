import React, { useEffect, useState } from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message, Typography, Spin } from 'antd';

const { Title } = Typography;

const TermsAndconditions = () => {
  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    fetchContentData();
  }, []);

  // Converts emails into clickable links
  const convertEmailsToLinks = (text) => {
    if (!text) return '';
    return text.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      "<a href='mailto:$1' style='color:#1890ff; text-decoration:underline;'>$1</a>"
    );
  };

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
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
      {loading ? (
        <Spin tip="Loading content..." />
      ) : (
        <>
          {/* Privacy Policy Section */}
          <Title level={3} style={{ marginBottom: '1rem' }}>
            Privacy Policy
          </Title>
          {contentData?.privacy_policy?.map((item) => (
            <div
              key={item.id}
              style={{
                whiteSpace: 'pre-line',
                lineHeight: '1.7',
                marginBottom: '1.5rem',
              }}
              dangerouslySetInnerHTML={{
                __html: convertEmailsToLinks(item.message),
              }}
            />
          ))}

          {/* Terms & Conditions Section */}
          <Title level={3} style={{ marginTop: '2rem', marginBottom: '1rem' }}>
            Terms & Conditions
          </Title>
          {contentData?.terms_conditions?.map((item) => (
            <div
              key={item.id}
              style={{
                whiteSpace: 'pre-line',
                lineHeight: '1.7',
                marginBottom: '1.5rem',
              }}
              dangerouslySetInnerHTML={{
                __html: convertEmailsToLinks(item.message),
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TermsAndconditions;
