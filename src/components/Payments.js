/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Input, Form, Dropdown, Menu } from 'antd';
import {
  LeftOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';

const initialCards = [
  {
    id: 1,
    type: 'Visa',
    last4: '8456',
    isDefault: true,
    brandIcon:
      'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
    number: '4130 0000 0000 8456',
    exp: '03/24',
    cvv: '123',
    name: 'Jane Doe',
  },
  {
    id: 2,
    type: 'Mastercard',
    last4: '8456',
    isDefault: false,
    brandIcon:
      'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: '5100 0000 0000 8456',
    exp: '04/25',
    cvv: '456',
    name: 'Jane Doe',
  },
];

const LAST4_DIGITS = 4;
const CARD_BG_DEFAULT = '#fff';
const CARD_BG_HIGHLIGHT = '#fafcff';

const getBrandFromNumber = (cardNumber) => {
  if (typeof cardNumber !== 'string') return 'Mastercard';
  return cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
};

const getBrandIconFromNumber = (cardNumber) => {
  if (typeof cardNumber !== 'string') return undefined;
  if (cardNumber.startsWith('4')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png';
  }
  if (cardNumber.startsWith('5')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png';
  }
  return undefined;
};

const getCardBackground = (card) => (card.isDefault ? CARD_BG_HIGHLIGHT : CARD_BG_DEFAULT);

const Payments = () => {
  const [cards, setCards] = useState(initialCards);
  const [editCard, setEditCard] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [form] = Form.useForm();
  const [view, setView] = useState('list');

  const handleDelete = (id) => {
    setDeleteCardId(id);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    setCards(cards.filter((card) => card.id !== deleteCardId));
    setShowDelete(false);
    setDeleteCardId(null);
  };

  const handleAdd = () => {
    setEditCard(null);
    form.resetFields();
    setView('add');
  };

  const handleEdit = (card) => {
    setEditCard(card);
    form.setFieldsValue({
      number: card.number,
      exp: card.exp,
      cvv: card.cvv,
      name: card.name,
    });
    setView('edit');
  };

  const handleFormFinish = (values) => {
    if (editCard) {
      setCards(
        cards.map((card) =>
          card.id === editCard.id ? { ...card, ...values } : card
        )
      );
    } else {
      const newCard = {
        id: Date.now(),
        type: getBrandFromNumber(values.number),
        last4: values.number.slice(-LAST4_DIGITS),
        isDefault: false,
        brandIcon: getBrandIconFromNumber(values.number),
        ...values,
      };
      setCards([...cards, newCard]);
    }
    setView('list');
    setEditCard(null);
    form.resetFields();
  };

  

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '0',
        background: '#fff',
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>
        Payments
      </div>
      {view === 'list' && (
        <>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            <span style={{ marginRight: 8 }}>🪪</span>Default Card
          </div>
          <div style={{ borderBottom: '1px solid #eee', marginBottom: 12 }} />
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: getCardBackground(card),
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                position: 'relative',
              }}
            >
              <img
                src={card.brandIcon}
                alt={card.type}
                style={{
                  width: 38,
                  height: 24,
                  objectFit: 'contain',
                  marginRight: 12,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  {card.type}{' '}
                  <span style={{ color: '#888', fontWeight: 400 }}>
                    {' '}
                    *{card.last4}
                  </span>
                </div>
              </div>
              <Dropdown
                overlay={(
                  <Menu>
                    <Menu.Item key="edit" onClick={() => handleEdit(card)}>
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      key="delete"
                      onClick={() => handleDelete(card.id)}
                      style={{ color: '#f5222d' }}
                    >
                      Delete Card
                    </Menu.Item>
                  </Menu>
                )}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  icon={<EllipsisOutlined />}
                  style={{ fontSize: 20 }}
                />
              </Dropdown>
            </div>
          ))}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: '100%', borderRadius: 24, marginTop: 16 }}
            onClick={handleAdd}
          >
            Add new Card
          </Button>
        </>
      )}
      {(view === 'add' || view === 'edit') && (
        <>
          <Button
            type="text"
            icon={<LeftOutlined />}
            style={{ marginBottom: 16 }}
            onClick={() => {
              setView('list');
              setEditCard(null);
            }}
          />
          <div style={{ fontWeight: 600, color: '#1890ff', marginBottom: 16 }}>
            Card details
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormFinish}
            initialValues={{ number: '', exp: '', cvv: '', name: '' }}
          >
            <Form.Item
              name="number"
              label="Card Number"
              rules={[{ required: true, message: 'Please enter card number' }]}
              normalize={(val) =>
                val
                  .replace(/[^0-9 ]/g, '')
                  .replace(/(\d{4})/g, '$1 ')
                  .trim()
              }
            >
              <Input
                suffix={(
                  <img
                    src={getBrandIconFromNumber(form.getFieldValue('number'))}
                    alt="brand"
                    style={{ width: 32, height: 20, objectFit: 'contain' }}
                  />
                )}
                placeholder="Card Number"
                maxLength={19}
              />
            </Form.Item>
            <div style={{ display: 'flex', gap: 12 }}>
              <Form.Item
                name="exp"
                label="Exp Date"
                rules={[{ required: true, message: 'Enter exp date' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="MM/YY" maxLength={5} />
              </Form.Item>
              <Form.Item
                name="cvv"
                label="CVV"
                rules={[{ required: true, message: 'Enter CVV' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="CVV" maxLength={4} />
              </Form.Item>
            </div>
            <Form.Item
              name="name"
              label="Name On The Card"
              rules={[{ required: true, message: 'Enter name' }]}
            >
              <Input placeholder="Name On The Card" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', borderRadius: 24, marginTop: 8 }}
            >
              Add new Card
            </Button>
          </Form>
        </>
      )}
      <Modal
        open={showDelete}
        onCancel={() => setShowDelete(false)}
        footer={null}
        centered
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          Are You Sure You Want To Delete This Card
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Button
            onClick={() => setShowDelete(false)}
            style={{ width: 100, borderRadius: 24 }}
          >
            No
          </Button>
          <Button
            type="primary"
            style={{ width: 100, borderRadius: 24 }}
            onClick={confirmDelete}
          >
            Yes
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Payments;