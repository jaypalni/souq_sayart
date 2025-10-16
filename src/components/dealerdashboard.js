/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef } from 'react';
import { Button, Tooltip, message, Modal } from 'antd';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  CheckCircleFilled,
  UploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

const DealerDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef(null);

  // ✅ Handle file selection (only .xlsx)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isXLSX = file.name.toLowerCase().endsWith('.xlsx');
    if (!isXLSX) {
      messageApi.open({
        type: 'error',
        content: 'Only .XLSX files are supported.',
      });
      event.target.value = ''; // clear file input
      return;
    }

    setSelectedFile(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/example_template.xlsx';
    link.download = 'Template_Format.xlsx';
    link.click();
  };

  // ✅ Function to handle API upload
  const uploadFileToAPI = async (file, status) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Call the API with status or without it
      const carResponse = status !== undefined
        ? await carAPI.uploadbulkdata(formData, status)
        : await carAPI.uploadbulkdata(formData);

      const responseData = handleApiResponse(carResponse);

      if (responseData) {
        setUploadResult({
          totalRecords: responseData.total_records || 0,
          successCount: responseData.success_count || 0,
          errorCount: responseData.error_count || responseData.total_errors || 0,
          errors: responseData.errors || [],
          message: responseData.message,
        });
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error', error);
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData?.message || 'Failed to upload file.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Upload File (with status=false)
  const handleUpload = async () => {
    if (!selectedFile) {
      messageApi.open({
        type: 'error',
        content: 'Please select a file before uploading.',
      });
      return;
    }

    const maxFileSizeMB = 5;
    if (selectedFile.size / 1024 / 1024 > maxFileSizeMB) {
      messageApi.open({
        type: 'error',
        content: `File size must not exceed ${maxFileSizeMB}MB.`,
      });
      return;
    }

    await uploadFileToAPI(selectedFile, false); // send status=false
  };

  // ✅ Confirm Draft Creation (same file, no status param)
  const handleConfirmDraft = async () => {
    setIsModalVisible(false);
    if (selectedFile) {
      await uploadFileToAPI(selectedFile); // no status param
      messageApi.open({
        type: 'success',
        content: 'Valid listings saved as drafts successfully!',
      });
    } else {
      messageApi.open({
        type: 'error',
        content: 'No file available to re-upload.',
      });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
        padding: '40px',
      }}
    >
      {contextHolder}
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
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            id="uploadXLSX"
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
              <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '8px' }}>
                Up to 5MB or 500 listings per file.<br />
                Only .XLSX files are supported.
              </p>
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

        {/* Download Box */}
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

      {/* ✅ Upload Results Modal */}
      <Modal
        open={isModalVisible}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExclamationCircleOutlined style={{ color: '#008AD5', fontSize: '20px' }} />
            <span style={{ fontWeight: '600', color: '#4A5E6D' }}>
              Upload Validation Summary
            </span>
          </div>
        }
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmDraft}
            style={{ backgroundColor: '#008AD5' }}
          >
            Confirm Draft Creation
          </Button>,
        ]}
        centered
      >
        {uploadResult && (
          <div style={{ marginTop: '16px' }}>
            <p><strong>Total Records:</strong> {uploadResult.totalRecords}</p>
            <p><strong>Valid Records:</strong> {uploadResult.successCount}</p>
            <p><strong>Invalid/Error Records:</strong> {uploadResult.errorCount}</p>
            <p style={{ color: '#4A5E6D', fontStyle: 'italic' }}>{uploadResult.message}</p>

            {uploadResult.errors.length > 0 && (
              <div
                style={{
                  backgroundColor: '#FFF8F8',
                  border: '1px solid #FFD1D1',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '10px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                }}
              >
                <strong>Errors:</strong>
                <ul style={{ margin: '8px 0 0 16px', color: '#B91C1C' }}>
                  {uploadResult.errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DealerDashboard;
