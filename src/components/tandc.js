import React, { useEffect, useState } from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message, Typography, Spin } from 'antd';
import PlaneBanner from '../components/planeBanner';

const { Title, Paragraph } = Typography;

const TandC = () => {
  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    fetchContentData();
  }, []);
  
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
    <>
      <PlaneBanner />
      <div style={{ maxWidth: 800, margin: '0 auto', marginTop: '20px' }}>
        <Typography>
          {loading ? (
            <Spin tip="Loading content..." />
          ) : (
            <>
              {/* Terms & Conditions Section */}
              
              {contentData?.terms_conditions?.map((item) => (
                <Paragraph
                  key={item.id}
                  style={{ whiteSpace: 'pre-line', lineHeight: '1.7', color: '#959595', fontSize: '16px', fontWeight: '400' }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: convertEmailsToLinks(item.message),
                    }}
                  />
                </Paragraph>
              ))}
            </>
          )}
        </Typography>
      </div>
    </>
  );
};

export default TandC;
