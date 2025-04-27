import React, { useEffect, useState } from 'react';
import { Typography, Button, Tabs, message, Spin, Card } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { Match } from '../api/matchingApi';
import matchingApi from '../api/matchingApi';
import MatchList from '../components/matching/MatchList';
import authApi, { UserProfile } from '../api/authApi';

const { Title } = Typography;
const { TabPane } = Tabs;

const MyMatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userType, setUserType] = useState<'demander' | 'traveler' | undefined>();
  const [activeTab, setActiveTab] = useState<string>('demander');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const fetchUserRole = async () => {
    try {
      const user = await authApi.getCurrentUser();
      setCurrentUser(user);
      
      // This would depend on how roles are stored in your application
      const hasDemanderRole = user.roles.includes('DEMANDER');
      const hasTravelerRole = user.roles.includes('TRAVELER');
      
      if (hasDemanderRole && hasTravelerRole) {
        // User has both roles, initial tab will control what we show
        setUserType(activeTab as 'demander' | 'traveler');
      } else if (hasDemanderRole) {
        setUserType('demander');
        setActiveTab('demander');
      } else if (hasTravelerRole) {
        setUserType('traveler');
        setActiveTab('traveler');
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      message.error('Failed to load user information');
    }
  };
  
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await matchingApi.getMyMatches();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      message.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserRole();
  }, []);
  
  useEffect(() => {
    if (userType) {
      fetchMatches();
    }
  }, [userType]);
  
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setUserType(key as 'demander' | 'traveler');
  };
  
  const refreshMatches = () => {
    fetchMatches();
  };
  
  if (!userType || !currentUser) {
    return <Spin size="large" />;
  }
  
  // Check if user has both roles
  const hasBothRoles = 
    currentUser.roles.includes('DEMANDER') && 
    currentUser.roles.includes('TRAVELER');
  
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>My Matches</Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={refreshMatches}
          loading={loading}
        >
          Refresh
        </Button>
      </div>
      
      <Card>
        {hasBothRoles ? (
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Demander Matches" key="demander">
              <MatchList 
                matches={matches.filter(m => m.demandUserId === String(currentUser.id))} 
                userType="demander"
                loading={loading}
                onRefresh={refreshMatches}
              />
            </TabPane>
            <TabPane tab="Traveler Matches" key="traveler">
              <MatchList 
                matches={matches.filter(m => String(m.journeyUserId) === String(currentUser.id))} 
                userType="traveler"
                loading={loading}
                onRefresh={refreshMatches}
              />
            </TabPane>
          </Tabs>
        ) : (
          <MatchList 
            matches={matches} 
            userType={userType}
            loading={loading}
            onRefresh={refreshMatches}
          />
        )}
      </Card>
    </div>
  );
};

export default MyMatchesPage; 