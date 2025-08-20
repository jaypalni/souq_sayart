
/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { message } from 'antd';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getMessages();
        const data = handleApiResponse(response);
        setMessages(data || []);
      } catch (error) {
        const errorData = handleApiError(error);
        message.error(errorData.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className={clsx('messages-container', { loading })}>
      <h2>User Messages</h2>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length > 0 ? (
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>{msg.text}</li>
          ))}
        </ul>
      ) : (
        <p>No messages found</p>
      )}
    </div>
  );
};

export default Messages;
