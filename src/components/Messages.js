import React, { useState } from 'react';
import { Input, Button, Tabs, Avatar, Dropdown, Menu } from 'antd';
import { SendOutlined, EllipsisOutlined } from '@ant-design/icons';
import '../assets/styles/messages.css';

const mockChats = [
  {
    id: 1,
    name: 'Moe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    verified: true,
    lastMessage: '2021 Porsche 992 Turbo S',
    time: '03:49 PM',
    unread: true,
    publishedAds: 1,
    joined: '04/10/2024',
    address: 'Address',
    messages: [
      {
        id: 1,
        text: 'Hi! Sure thing. This is a 2019 Porsche with no mileage clean history and in perfect condition. It features the leather seats and a sunroof. Do you want to know anything specific about the pricing?',
        sender: 'Moe',
        time: '03:49 PM',
        isOwn: false
      },
      {
        id: 2,
        text: 'It has 52,000 miles on it, and everything works perfectly. It\'s naturally serviced and in excellent condition. Would you like to arrange a test drive?',
        sender: 'Moe',
        time: '03:50 PM',
        isOwn: false
      },
      {
        id: 3,
        text: 'Hello is this still available?',
        sender: 'You',
        time: '03:51 PM',
        isOwn: true
      },
      {
        id: 4,
        text: 'Yes',
        sender: 'Moe',
        time: '03:52 PM',
        isOwn: false
      }
    ]
  },
  {
    id: 2,
    name: 'Ziad',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    verified: false,
    lastMessage: '2021 Porsche 992 Turbo S',
    time: '02:30 PM',
    unread: false,
    publishedAds: 0,
    joined: '04/01/2024',
    address: 'Address',
    messages: []
  },
  {
    id: 3,
    name: 'Ayoub',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    verified: false,
    lastMessage: '2021 Porsche 992 Turbo S',
    time: '01:15 PM',
    unread: false,
    publishedAds: 0,
    joined: '03/28/2024',
    address: 'Address',
    messages: []
  }
];

const QuickActionsMenu = ({ onDelete, onReport, onBlock }) => (
  <Menu>
    <Menu.Item key="delete" onClick={onDelete} style={{ color: '#f5222d' }}>Delete Chat</Menu.Item>
    <Menu.Item key="report" onClick={onReport}>Report User</Menu.Item>
    <Menu.Item key="block" onClick={onBlock}>Block user</Menu.Item>
  </Menu>
);

const ChatList = ({ chats, selectedChat, onSelectChat, onShowMenu }) => (
  <div className="chat-list">
    {chats.map(chat => (
      <div
        key={chat.id}
        className={`chat-list-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
        onClick={() => onSelectChat(chat)}
      >
        <div className="chat-list-item-avatar">
          <Avatar src={chat.avatar} size={40} />
          {chat.verified && <div className="verified-badge">✓</div>}
        </div>
        <div className="chat-list-item-content">
          <div className="chat-list-item-header">
            <span className="chat-list-item-name">{chat.name}</span>
            <span className="chat-list-item-time">{chat.time}</span>
          </div>
          <div className="chat-list-item-message">
            {chat.lastMessage}
            {chat.unread && <span className="unread-indicator">•</span>}
          </div>
        </div>
        <Dropdown
          overlay={<QuickActionsMenu onDelete={() => onShowMenu('delete', chat)} onReport={() => onShowMenu('report', chat)} onBlock={() => onShowMenu('block', chat)} />}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<EllipsisOutlined />} className="chat-list-item-menu" onClick={e => e.stopPropagation()} />
        </Dropdown>
      </div>
    ))}
  </div>
);

const ChatView = ({ chat }) => {
  const [message, setMessage] = useState('');

  if (!chat) {
    return (
      <div className="chat-view-empty">
        <div>Select a conversation to start messaging</div>
      </div>
    );
  }

  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-view">
      <div className="chat-view-header">
        <Avatar src={chat.avatar} size={40} />
        <div className="chat-view-header-info">
          <div className="chat-view-header-name">
            {chat.name}
            {chat.verified && <span className="verified-badge">✓</span>}
          </div>
          <div className="chat-view-header-status">Online</div>
        </div>
      </div>
      <div className="chat-view-messages">
        <div className="message-date-divider">Tuesday, April 22</div>
        {chat.messages.map(msg => (
          <div key={msg.id} className={`message ${msg.isOwn ? 'own' : ''}`}>
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-view-input">
        <Input.TextArea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!message.trim()}
        />
      </div>
    </div>
  );
};

const UserProfilePanel = ({ user, onAction }) => {
  if (!user) return <div className="user-profile-fixed-panel" />;
  return (
    <div className="user-profile-fixed-panel">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0 16px 0' }}>
        <Avatar src={user.avatar} size={64} style={{ background: '#e3f1ff', color: '#1890ff', fontWeight: 700, marginBottom: 8 }}>
          {user.name[0]}
        </Avatar>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{user.name} {user.verified && <span className="verified-badge">✓</span>}</div>
        <div style={{ color: '#888', fontSize: 14, margin: '4px 0' }}>{user.publishedAds} Published ads</div>
        <div style={{ color: '#888', fontSize: 13 }}>Joined on {user.joined}</div>
        <div style={{ color: '#888', fontSize: 13 }}>{user.address}</div>
        <Button type="primary" style={{ marginTop: 16, width: 180, borderRadius: 24 }}>View Profile</Button>
      </div>
      <div style={{ padding: '0 24px' }}>
        <div style={{ fontWeight: 600, fontSize: 15, margin: '16px 0 8px 0' }}>Quick Actions</div>
        <div className="user-profile-actions">
          <div className="user-profile-action delete" onClick={() => onAction('delete', user)}>Delete Chat</div>
          <div className="user-profile-action" onClick={() => onAction('report', user)}>Report User</div>
          <div className="user-profile-action" onClick={() => onAction('block', user)}>Block user</div>
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChat, setSelectedChat] = useState(null);
  const [popupAction, setPopupAction] = useState(null); // { type, user }

  const handleShowMenu = (type, user) => {
    setPopupAction({ type, user });
    setTimeout(() => setPopupAction(null), 1200);
  };

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'All' },
            { key: 'buying', label: 'Buying' },
            { key: 'selling', label: 'Selling' },
            { key: 'unread', label: 'Unread' }
          ]}
        />
        <ChatList
          chats={mockChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onShowMenu={handleShowMenu}
        />
      </div>
      <div className="messages-main">
        <ChatView chat={selectedChat} />
      </div>
      <UserProfilePanel user={selectedChat} onAction={handleShowMenu} />
    </div>
  );
};

export default Messages; 