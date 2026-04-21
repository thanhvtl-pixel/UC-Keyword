import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  ShoppingOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  IdcardOutlined,
  ShopOutlined,
  FileProtectOutlined,
  TeamOutlined,
  MailOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  DatabaseOutlined,
  TagsOutlined
} from '@ant-design/icons';
import { CaliloFieldManager } from './CaliloFieldManager';
import { ImageWithFallback } from './figma/ImageWithFallback';

const { Sider, Content } = Layout;

export const UrCardPortal: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('calilo-fields');

  const menuItems = [
    {
      key: 'quick-orders',
      icon: <ShoppingOutlined />,
      label: 'Quick Product Orders',
    },
    {
      key: 'deal-hubspot',
      icon: <CustomerServiceOutlined />,
      label: 'Quản lý Deal Hubspot',
    },
    {
      key: 'publisher',
      icon: <FileTextOutlined />,
      label: 'Quản lý nhà phát hành',
    },
    {
      key: 'policy',
      icon: <FileProtectOutlined />,
      label: 'Quản lý chính sách',
    },
    {
      key: 'cardholder',
      icon: <IdcardOutlined />,
      label: 'Quản lý Chủ thẻ Số',
    },
    {
      key: 'merchant',
      icon: <ShopOutlined />,
      label: 'Quản lý Merchant',
    },
    {
      key: 'po',
      icon: <FileTextOutlined />,
      label: 'Quản lý PO',
    },
    {
      key: 'contract',
      icon: <FileProtectOutlined />,
      label: 'Quản lý hợp đồng',
    },
    {
      key: 'auto-email',
      icon: <MailOutlined />,
      label: 'Gửi email tự động',
    },
    {
      key: 'payment-request',
      icon: <DollarOutlined />,
      label: 'Yêu cầu thanh toán',
    },
    {
      key: 'report',
      icon: <BarChartOutlined />,
      label: 'Quản lý báo cáo',
    },
    {
      key: 'calilo-platform',
      icon: <DatabaseOutlined />,
      label: 'Calilo platform',
      children: [
        {
          key: 'calilo-fields',
          label: 'Quản lý field Calilo',
        }
      ]
    },
    {
      key: 'urhost',
      icon: <SettingOutlined />,
      label: 'UrHost',
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'calilo-fields':
        return <CaliloFieldManager />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <p className="text-lg">Chức năng đang phát triển</p>
              <p className="text-sm mt-2">Menu: {menuItems.find(m => m.key === selectedMenu)?.label}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', background: '#eff0f9' }}>
      <Sider
        width={230}
        style={{
          background: '#001529',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="flex items-center justify-center py-5 px-4" style={{ paddingTop: '20px', paddingBottom: '10px' }}>
          <ImageWithFallback
            src="https://urcard-portal-web.urbox.dev/_next/image?url=%2Fimages%2FLogo.png&w=64&q=75"
            alt="UrCard Logo"
            className="h-12"
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          defaultOpenKeys={['calilo-platform']}
          onClick={({ key }) => setSelectedMenu(key)}
          items={menuItems}
          style={{
            background: '#001529',
            border: 'none',
          }}
          theme="dark"
        />
        <div className="absolute bottom-4 left-4 text-xs text-slate-500">
          Version 0.8.3
        </div>
      </Sider>
      <Layout style={{ marginLeft: 230 }}>
        <Content style={{ background: '#eff0f9', minHeight: '100vh' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};