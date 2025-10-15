import React, { useEffect, useState } from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message, Typography, Spin } from 'antd';
import PlaneBanner from '../components/planeBanner';

const { Title } = Typography;

const TandC = () => {
  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState(null);

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
      const errorData = handleApiError(error);
      message.error(errorData.message);
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
            {contentData?.terms_conditions?.length > 0 ? (
              contentData.terms_conditions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    color: '#555',
                    lineHeight: '1.8',
                    fontSize: '16px',
                    marginBottom: '24px',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: convertEmailsToLinks(item.message),
                  }}
                />
              ))
            ) : (
              <p style={{ color: '#999', textAlign: 'center' }}>
                No Terms & Conditions available.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TandC;
