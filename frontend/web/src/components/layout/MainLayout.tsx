import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Space, theme } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  SendOutlined, 
  CarOutlined,
  ShoppingOutlined,
  BellOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
  DollarOutlined,
  TeamOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { selectUnreadCount } from '../../store/slices/notificationSlice';
import { logout } from '../../store/slices/authSlice';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { useTranslation } from 'react-i18next';

const { Header, Sider, Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarCollapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const unreadCount = useSelector(selectUnreadCount);
  const currentTheme = useSelector((state: RootState) => state.ui.theme);
  
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: t('menu.home'),
    },
    {
      key: '/demands',
      icon: <SendOutlined />,
      label: t('menu.demands'),
    },
    {
      key: '/journeys',
      icon: <CarOutlined />,
      label: t('menu.journeys'),
    },
    {
      key: '/orders',
      icon: <ShoppingOutlined />,
      label: t('menu.orders'),
      hidden: !isAuthenticated,
    },
    {
      key: '/about',
      icon: <TeamOutlined />,
      label: t('menu.about'),
    },
  ].filter(item => !item.hidden);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        <UserOutlined /> {t('menu.profile')}
      </Menu.Item>
      <Menu.Item key="orders" onClick={() => navigate('/orders')}>
        <ShoppingOutlined /> {t('menu.orders')}
      </Menu.Item>
      <Menu.Item key="wallet" onClick={() => navigate('/wallet')}>
        <DollarOutlined /> {t('menu.wallet')}
      </Menu.Item>
      <Menu.Item key="reviews" onClick={() => navigate('/reviews')}>
        <StarOutlined /> {t('menu.reviews')}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LoginOutlined /> {t('menu.logout')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={sidebarCollapsed}
        theme={currentTheme as 'light' | 'dark'}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div style={{ 
          height: 64, 
          margin: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
        }}>
          <Logo style={{ height: 40, width: 40, marginRight: sidebarCollapsed ? 0 : 8 }} />
          {!sidebarCollapsed && (
            <h1 style={{ color: token.colorPrimary, fontSize: 18, margin: 0 }}>BangBang</h1>
          )}
        </div>
        <Menu
          theme={currentTheme as 'light' | 'dark'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 16px', 
          background: token.colorBgContainer,
          position: 'sticky',
          top: 0,
          zIndex: 9,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
        }}>
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => dispatch(toggleSidebar())}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Space size="large">
            <Dropdown placement="bottomRight" overlay={
              <Menu>
                <Menu.Item key="zh" onClick={() => console.log('Switch to Chinese')}>中文</Menu.Item>
                <Menu.Item key="en" onClick={() => console.log('Switch to English')}>English</Menu.Item>
                <Menu.Item key="ar" onClick={() => console.log('Switch to Arabic')}>العربية</Menu.Item>
              </Menu>
            }>
              <Button type="text" icon={<GlobalOutlined />} />
            </Dropdown>
            
            {isAuthenticated ? (
              <>
                <Badge count={unreadCount} size="small">
                  <Button 
                    type="text" 
                    icon={<BellOutlined />} 
                    onClick={() => navigate('/notifications')} 
                  />
                </Badge>
                <Dropdown overlay={userMenu} placement="bottomRight">
                  <div style={{ cursor: 'pointer' }}>
                    <Avatar src={user?.profileImageUrl} icon={<UserOutlined />} /> 
                    <span style={{ marginLeft: 8 }}>{user?.username || '用户'}</span>
                  </div>
                </Dropdown>
              </>
            ) : (
              <Space>
                <Button type="link" onClick={() => navigate('/login')}>
                  {t('auth.login')}
                </Button>
                <Button type="primary" onClick={() => navigate('/register')}>
                  {t('auth.register')}
                </Button>
              </Space>
            )}
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', overflow: 'initial', minHeight: 280 }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 8 }}>
            <Link to="/about" style={{ marginRight: 12 }}>{t('footer.about')}</Link>
            <Link to="/terms" style={{ marginRight: 12 }}>{t('footer.terms')}</Link>
            <Link to="/privacy" style={{ marginRight: 12 }}>{t('footer.privacy')}</Link>
            <Link to="/help">{t('footer.help')}</Link>
          </div>
          <div>BangBang Delivery ©{new Date().getFullYear()} - {t('footer.rights')}</div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 