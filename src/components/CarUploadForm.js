import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError, createFormData } from '../utils/apiUtils';
import '../assets/styles/carUpload.css';

const { Option } = Select;

const CarUploadForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const carResponse = await carAPI.uploadOptionDetails(values);
      const carData = handleApiResponse(carResponse);
      
      if (carData && fileList.length > 0) {
        const formData = createFormData({
          carId: carData.id,
          images: fileList.map(file => file.originFileObj)
        });
        
        await carAPI.uploadImages(formData);
      }
      
      message.success('Car details uploaded successfully!');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to upload car details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Card className="car-upload-container">
      <h2>Upload Car Details</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="car-upload-form"
      >
        <Form.Item
          name="make"
          label="Car Make"
          rules={[{ required: true, message: 'Please enter car make' }]}
        >
          <Input placeholder="Enter car make" />
        </Form.Item>

        <Form.Item
          name="model"
          label="Car Model"
          rules={[{ required: true, message: 'Please enter car model' }]}
        >
          <Input placeholder="Enter car model" />
        </Form.Item>

        <Form.Item
          name="year"
          label="Year"
          rules={[{ required: true, message: 'Please enter year' }]}
        >
          <Input type="number" placeholder="Enter year" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>

        <Form.Item
          name="condition"
          label="Condition"
          rules={[{ required: true, message: 'Please select condition' }]}
        >
          <Select placeholder="Select condition">
            <Option value="new">New</Option>
            <Option value="used">Used</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="transmission"
          label="Transmission"
          rules={[{ required: true, message: 'Please select transmission' }]}
        >
          <Select placeholder="Select transmission">
            <Option value="automatic">Automatic</Option>
            <Option value="manual">Manual</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fuelType"
          label="Fuel Type"
          rules={[{ required: true, message: 'Please select fuel type' }]}
        >
          <Select placeholder="Select fuel type">
            <Option value="petrol">Petrol</Option>
            <Option value="diesel">Diesel</Option>
            <Option value="electric">Electric</Option>
            <Option value="hybrid">Hybrid</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Car Images"
          name="images"
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            multiple
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block
            className="submit-button"
          >
            Upload Car Details
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CarUploadForm; 