import React, { useState } from 'react';
import PlaneBanner from '../components/planeBanner';

const faqData = [
  {
    question: 'Lorem ipsum dolor sit amet consectetur.',
    answer: 'Lorem ipsum dolor sit amet consectetur. Aliquet purus gravida lectus commodo. Quam et bibendum platea vulputate sit dictum. Mauris scelerisque sollicitudin diam nascetur massa viverra id viverra. Morbi rhoncus ultricies duis sed maecenas.'
  },
  {
    question: 'Habitasse fermentum dignissim eleifend enim ullamcorper. ',
    answer: 'Lorem ipsum dolor sit amet consectetur. Aliquet purus gravida lectus commodo. Quam et bibendum platea vulputate sit dictum. Mauris scelerisque sollicitudin diam nascetur massa viverra id viverra. Morbi rhoncus ultricies duis sed maecenas.'
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur.',
    answer: 'Lorem ipsum dolor sit amet consectetur. Aliquet purus gravida lectus commodo. Quam et bibendum platea vulputate sit dictum. Mauris scelerisque sollicitudin diam nascetur massa viverra id viverra. Morbi rhoncus ultricies duis sed maecenas.'
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur.',
    answer: 'Lorem ipsum dolor sit amet consectetur. Aliquet purus gravida lectus commodo. Quam et bibendum platea vulputate sit dictum. Mauris scelerisque sollicitudin diam nascetur massa viverra id viverra. Morbi rhoncus ultricies duis sed maecenas.'
  },
];

const FaqS = () => {
  const [openIndex, setOpenIndex] = useState(null);

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

  return (
    <>
      <PlaneBanner />
      <div style={{ maxWidth: 800, margin: '0 auto', marginTop: '20px' }}>
        {faqData.map((item, index) => (
          <div 
            key={index} 
            style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}
          >
            <div
              onClick={() => toggleDropdown(index)}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                fontWeight: '700', 
                cursor: 'pointer', 
                fontSize: '14px' 
              }}
            >
              {item.question}
              {/* Dropdown arrow */}
              <span 
                style={{ 
                  display: 'inline-block', 
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.3s' 
                }}
              >
                ▼
              </span>
            </div>
            {openIndex === index && (
              <div
                style={{ marginTop: '5px', fontWeight: 'normal', fontSize: '15px', lineHeight: '1.5', fontSize: '14px', fontWeight: '400', color: '#908B8B' }}
                dangerouslySetInnerHTML={{ __html: convertEmailsToLinks(item.answer) }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default FaqS;
