import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Drawer } from 'antd';
import { 
  HomeOutlined, 
  PlusOutlined, 
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  LoginOutlined,
  GiftOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { RootState } from './store';
import { logout } from './store/slices/authSlice';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreateTaskPage from './pages/CreateTaskPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import MyTasksPage from './pages/MyTasksPage';
import NotificationsPage from './pages/NotificationsPage';
import JourneysPage from './pages/JourneysPage';
import JourneyDetailsPage from './pages/JourneyDetailsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import { AppDispatch } from './store';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuVisible(false);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="my-tasks" icon={<GiftOutlined />}>
        <Link to="/my-tasks">My Tasks</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const renderMobileMenu = () => (
    <Drawer
      title="Menu"
      placement="left"
      onClose={() => setMobileMenuVisible(false)}
      open={mobileMenuVisible}
      width={250}
    >
      <Menu mode="vertical" selectedKeys={[location.pathname]} style={{ border: 'none' }}>
        <Menu.Item key="/" icon={<HomeOutlined />} onClick={() => setMobileMenuVisible(false)}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/journeys" icon={<GlobalOutlined />} onClick={() => setMobileMenuVisible(false)}>
          <Link to="/journeys">Journeys</Link>
        </Menu.Item>
        <Menu.Item key="/how-it-works" icon={<QuestionCircleOutlined />} onClick={() => setMobileMenuVisible(false)}>
          <Link to="/how-it-works">How It Works</Link>
        </Menu.Item>
        
        {isAuthenticated ? (
          <>
            <Menu.Divider />
            <Menu.Item key="/create-task" icon={<PlusOutlined />} onClick={() => setMobileMenuVisible(false)}>
              <Link to="/create-task">Post a Request</Link>
            </Menu.Item>
            <Menu.Item key="/notifications" icon={<BellOutlined />} onClick={() => setMobileMenuVisible(false)}>
              <Link to="/notifications">Notifications</Link>
            </Menu.Item>
            <Menu.Item key="/profile" icon={<UserOutlined />} onClick={() => setMobileMenuVisible(false)}>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="/my-tasks" icon={<GiftOutlined />} onClick={() => setMobileMenuVisible(false)}>
              <Link to="/my-tasks">My Tasks</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Divider />
            <Menu.Item key="/login" icon={<LoginOutlined />} onClick={() => setMobileMenuVisible(false)}>
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="/register" onClick={() => setMobileMenuVisible(false)}>
              <Link to="/register">Register</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Drawer>
  );

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        {isMobile && (
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            onClick={() => setMobileMenuVisible(true)}
            style={{ marginRight: 16 }}
          />
        )}
        <div className="logo">
          <Link to="/">BangBang Delivery</Link>
        </div>
        {!isMobile ? (
          <div className="header-nav">
            <Menu mode="horizontal" selectedKeys={[location.pathname]} style={{ border: 'none', background: 'transparent' }}>
              <Menu.Item key="/" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="/journeys" icon={<GlobalOutlined />}>
                <Link to="/journeys">Journeys</Link>
              </Menu.Item>
              <Menu.Item key="/how-it-works" icon={<QuestionCircleOutlined />}>
                <Link to="/how-it-works">How It Works</Link>
              </Menu.Item>
            </Menu>
            
            {isAuthenticated ? (
              <>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  style={{ marginRight: 16 }}
                >
                  <Link to="/create-task">Post a Request</Link>
                </Button>
                <Badge count={3} dot style={{ marginRight: 16 }}>
                  <Link to="/notifications">
                    <Avatar icon={<BellOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#1890ff' }} />
                  </Link>
                </Badge>
                <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </Dropdown>
              </>
            ) : (
              <>
                <Button type="text" icon={<LoginOutlined />}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button type="primary">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="mobile-header-actions">
            {isAuthenticated && (
              <>
                <Badge count={3} dot style={{ marginRight: 16 }}>
                  <Link to="/notifications">
                    <Avatar size="small" icon={<BellOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#1890ff' }} />
                  </Link>
                </Badge>
                <Link to="/create-task">
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<PlusOutlined />} 
                    style={{ marginRight: 0 }}
                  />
                </Link>
              </>
            )}
          </div>
        )}
      </Header>
      {renderMobileMenu()}
      <Content className="app-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/task/:id" element={<TaskDetailsPage />} />
          <Route path="/journeys" element={<JourneysPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />

          {/* Protected routes */}
          <Route 
            path="/profile" 
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" state={{ from: location }} />} 
          />
          <Route 
            path="/create-task" 
            element={isAuthenticated ? <CreateTaskPage /> : <Navigate to="/login" state={{ from: location }} />} 
          />
          <Route 
            path="/my-tasks" 
            element={isAuthenticated ? <MyTasksPage /> : <Navigate to="/login" state={{ from: location }} />} 
          />
          <Route 
            path="/notifications" 
            element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" state={{ from: location }} />} 
          />
          <Route 
            path="/journey/:id" 
            element={isAuthenticated ? <JourneyDetailsPage /> : <Navigate to="/login" state={{ from: location }} />} 
          />
          <Route 
            path="/journey/new" 
            element={isAuthenticated ? <JourneysPage /> : <Navigate to="/login" state={{ from: location }} />} 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center', padding: isMobile ? '12px 0' : '24px 0' }}>
        BangBang Delivery ©{new Date().getFullYear()} Created by BangBang Team
      </Footer>
    </Layout>
  );
};

export default App; 