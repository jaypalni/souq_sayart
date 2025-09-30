import React, { useEffect, useState } from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message, Typography, Spin } from 'antd';

const { Title, Paragraph } = Typography;

const TermsAndconditions = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    fetchContentData();
  }, []);

  // Convert emails inside text into clickable mailto links
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
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {contextHolder}
      <Typography>
        {loading ? (
          <Spin tip="Loading content..." />
        ) : (
          <>
            {/* Privacy Policy Section */}
            <Title level={3} style={{ marginTop: '2rem' }}>
              Privacy Policy
            </Title>
            {contentData?.privacy_policy?.map((item) => (
              <Paragraph
                key={item.id}
                style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}
              >
                {item.message}
              </Paragraph>
            ))}

            {/* Terms & Conditions Section */}
            <Title level={3}>Terms & Conditions</Title>
            {contentData?.terms_conditions?.map((item) => (
              <Paragraph
                key={item.id}
                style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}
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
  );
};

export default TermsAndconditions;
