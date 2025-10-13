/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef } from 'react';
import { Button, Tooltip, message } from 'antd';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  CheckCircleFilled,
  UploadOutlined,
} from '@ant-design/icons';

const DealerDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/example_template.xlsx'; 
    link.download = 'Template_Format.xlsx';
    link.click();
  };

  const handleUpload = async () => {
    console.log('File Selected')
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
        padding: '40px',
      }}
    >
      {/* Dashboard Title */}
      <h2
        style={{
          color: '#4A5E6D',
          fontWeight: 600,
          marginBottom: '40px',
          textAlign: 'center',
        }}
      >
        Dashboard
      </h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          alignItems: 'flex-start',
        }}
      >
        {/* Upload Box */}
        <div
          style={{
            border: '2px dashed #E7EBEF',
            borderRadius: '12px',
            width: '300px',
            height: '260px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {/* Hidden file input (always present) */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            id="uploadExcel"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {!selectedFile ? (
            <>
              <CloudUploadOutlined
                style={{ fontSize: '36px', color: '#008AD5', marginBottom: '12px' }}
              />
              <p style={{ color: '#4A5E6D', fontWeight: 500, marginBottom: '8px' }}>
                Drag files to upload
              </p>

              <Button
                type="primary"
                style={{
                  backgroundColor: '#008AD5',
                  borderRadius: '22px',
                  fontWeight: '500',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </>
          ) : (
            <div
              style={{
                backgroundColor: '#008AD5',
                color: '#fff',
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                width: '90%',
              }}
            >
              <CheckCircleFilled style={{ fontSize: '36px', color: '#fff' }} />
              <span style={{ fontWeight: '600', fontSize: '16px' }}>File Added</span>
              <Button
                icon={<UploadOutlined />}
                loading={isUploading}
                onClick={handleUpload}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#008AD5',
                  borderRadius: '22px',
                  fontWeight: '500',
                  border: 'none',
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
              <Button
                type="text"
                onClick={handleClear}
                style={{
                  color: '#fff',
                  textDecoration: 'underline',
                  padding: 0,
                  height: 'auto',
                }}
              >
                Clear
              </Button>

              <Tooltip title={selectedFile.name}>
                <span
                  style={{
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '180px',
                  }}
                >
                  {selectedFile.name}
                </span>
              </Tooltip>
            </div>
          )}
        </div>

        <div
          style={{
            border: '2px dashed #E7EBEF',
            borderRadius: '12px',
            width: '300px',
            height: '260px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <DownloadOutlined
            style={{ fontSize: '36px', color: '#008AD5', marginBottom: '12px' }}
          />
          <p style={{ color: '#4A5E6D', fontWeight: 500, marginBottom: '8px' }}>
            Download Template Format
          </p>
          <Button
            type="primary"
            style={{
              backgroundColor: '#008AD5',
              borderRadius: '22px',
              fontWeight: '500',
            }}
            onClick={handleDownload}
          >
            Download Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
