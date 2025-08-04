import React from "react";
import { Typography, Card } from "antd";

const { Title, Paragraph, Text } = Typography;

const TermsAndconditions = () => {
  return (
    <div style={{ maxWidth: 800, margin: "5 auto", padding: "2rem" }}>
      <Typography>
        <Title level={3}>Terms & Conditions</Title>

        <Paragraph>
          Welcome to our application. By using our services, you agree to be
          bound by the following terms and conditions. Please read them
          carefully.
        </Paragraph>

        <Title level={4}>1. Acceptance of Terms</Title>
        <Paragraph>
          By accessing and using this app, you accept and agree to be bound by
          the terms and provision of this agreement. If you do not agree, you
          must not use the app.
        </Paragraph>

        <Title level={4}>2. Privacy Policy</Title>
        <Paragraph>
          We respect your privacy and are committed to protecting your personal
          data. Our Privacy Policy explains how we collect, use, and safeguard
          your information.
        </Paragraph>

        <Title level={4}>3. User Conduct</Title>
        <Paragraph>
          You agree not to misuse the app or help anyone else to do so. Misuse
          includes accessing or tampering with the app’s functionality, data, or
          resources.
        </Paragraph>

        <Title level={4}>4. Intellectual Property</Title>
        <Paragraph>
          All content on this app is the property of the company and is
          protected by copyright, trademark, and other intellectual property
          laws.
        </Paragraph>

        <Title level={4}>5. Termination</Title>
        <Paragraph>
          We may suspend or terminate your access if you violate these terms or
          engage in activities that may harm the app or other users.
        </Paragraph>

        <Title level={4}>6. Changes to Terms</Title>
        <Paragraph>
          We reserve the right to update these terms at any time. Continued use
          of the app after changes constitutes acceptance of the new terms.
        </Paragraph>

        <Paragraph>
          <Text strong>
            If you have any questions regarding these Terms & Conditions, please
            contact us at support@example.com.
          </Text>
        </Paragraph>
      </Typography>
    </div>
  );
};

export default TermsAndconditions;
