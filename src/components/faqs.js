/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useEffect, useState } from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message, Skeleton } from 'antd';
import PlaneBanner from '../components/planeBanner';

const FaqS = () => {
  const [faqData, setFaqData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const convertEmailsToLinks = (text) => {
    if (!text) return '';
    return text.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      "<a href='mailto:$1' style='color:#1890ff; text-decoration:underline;'>$1</a>"
    );
  };

  useEffect(() => {
    fetchFaqsData();
  }, []);

  const fetchFaqsData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getfaqs();
      const data1 = handleApiResponse(response);

      if (data1?.data?.faqs?.length) {
        setFaqData(data1.data.faqs);
      } else {
        message.warning('No FAQs found.');
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to fetch FAQs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PlaneBanner />

      <div style={{ maxWidth: 800, margin: '0 auto', marginTop: '20px' }}>
        {loading ? (
          // 👇 Show skeleton placeholders while loading
          <>
            {[...Array(5)].map((_, index) => (
              <div key={index} style={{ marginBottom: '30px' }}>
                <Skeleton
                  active
                  paragraph={{ rows: 2 }}
                  title={{ width: '60%' }}
                />
              </div>
            ))}
          </>
        ) : faqData.length > 0 ? (
          faqData.map((item, index) => (
            <div
              key={item.id}
              style={{
                marginBottom: '30px',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px',
              }}
            >
              <div
                onClick={() => toggleDropdown(index)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {item.question}
                <span
                  style={{
                    display: 'inline-block',
                    transform:
                      openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                >
                  ▼
                </span>
              </div>

              {openIndex === index && (
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    fontWeight: '400',
                    color: '#908B8B',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: convertEmailsToLinks(item.answer),
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>
            No FAQs available.
          </p>
        )}
      </div>
    </>
  );
};

export default FaqS;
