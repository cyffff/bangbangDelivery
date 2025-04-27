import React, { useState } from 'react';
import { List, Empty, Modal, message, Spin, Tabs } from 'antd';
import { Match } from '../../api/matchingApi';
import MatchCard from './MatchCard';
import matchingApi from '../../api/matchingApi';

interface MatchListProps {
  matches: Match[];
  loading?: boolean;
  userType: 'demander' | 'traveler';
  onRefresh?: () => void;
}

const MatchList: React.FC<MatchListProps> = ({ 
  matches, 
  loading = false, 
  userType,
  onRefresh 
}) => {
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);

  const handleConfirm = async (matchId: number) => {
    try {
      Modal.confirm({
        title: 'Confirm Match',
        content: 'Are you sure you want to confirm this match?',
        onOk: async () => {
          try {
            if (userType === 'demander') {
              await matchingApi.confirmMatchAsDemander(matchId, true);
            } else {
              await matchingApi.confirmMatchAsTraveler(matchId, true);
            }
            message.success('Match confirmed successfully');
            if (onRefresh) onRefresh();
          } catch (error) {
            message.error('Failed to confirm match');
            console.error(error);
          }
        }
      });
    } catch (error) {
      message.error('Failed to confirm match');
      console.error(error);
    }
  };

  const handleReject = async (matchId: number) => {
    try {
      Modal.confirm({
        title: 'Reject Match',
        content: 'Are you sure you want to reject this match?',
        okText: 'Yes, Reject',
        okType: 'danger',
        onOk: async () => {
          try {
            if (userType === 'demander') {
              await matchingApi.confirmMatchAsDemander(matchId, false);
            } else {
              await matchingApi.confirmMatchAsTraveler(matchId, false);
            }
            message.success('Match rejected');
            if (onRefresh) onRefresh();
          } catch (error) {
            message.error('Failed to reject match');
            console.error(error);
          }
        }
      });
    } catch (error) {
      message.error('Failed to reject match');
      console.error(error);
    }
  };

  // Group matches by status
  const proposedMatches = matches.filter(match => match.status === 'PROPOSED');
  const pendingMatches = matches.filter(match => match.status === 'PENDING');
  const confirmedMatches = matches.filter(match => match.status === 'CONFIRMED');
  const completedMatches = matches.filter(match => 
    match.status === 'COMPLETED' || match.status === 'REJECTED' || match.status === 'CANCELLED'
  );

  const renderList = (items: Match[]) => {
    if (items.length === 0) {
      return <Empty description="No matches found" />;
    }

    return (
      <List
        dataSource={items}
        renderItem={match => (
          <List.Item 
            key={match.id}
            onClick={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}
          >
            <MatchCard 
              match={match}
              userType={userType}
              onConfirm={handleConfirm}
              onReject={handleReject}
              expanded={expandedMatchId === match.id}
            />
          </List.Item>
        )}
      />
    );
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (matches.length === 0) {
    return <Empty description="No matches found" />;
  }

  return (
    <Tabs defaultActiveKey="proposed">
      <Tabs.TabPane tab={`Proposed (${proposedMatches.length})`} key="proposed">
        {renderList(proposedMatches)}
      </Tabs.TabPane>
      <Tabs.TabPane tab={`Pending (${pendingMatches.length})`} key="pending">
        {renderList(pendingMatches)}
      </Tabs.TabPane>
      <Tabs.TabPane tab={`Confirmed (${confirmedMatches.length})`} key="confirmed">
        {renderList(confirmedMatches)}
      </Tabs.TabPane>
      <Tabs.TabPane tab={`History (${completedMatches.length})`} key="history">
        {renderList(completedMatches)}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default MatchList; 