import React, { useState } from 'react';
import { Button, Modal, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import matchingApi, { Match } from '../../api/matchingApi';
import MatchList from './MatchList';

interface FindMatchesForJourneyProps {
  journeyId: number;
  buttonText?: string;
  buttonType?: 'primary' | 'default' | 'link' | 'text' | 'dashed' | undefined;
}

const FindMatchesForJourney: React.FC<FindMatchesForJourneyProps> = ({
  journeyId,
  buttonText = 'Find Matches',
  buttonType = 'primary',
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);

  const handleFindMatches = async () => {
    try {
      setLoading(true);
      const data = await matchingApi.findMatchesForJourney(journeyId);
      setMatches(data);
      if (data.length === 0) {
        message.info('No matching demands found for your journey');
      }
    } catch (error) {
      console.error('Error finding matches:', error);
      message.error('Failed to find matches');
    } finally {
      setLoading(false);
    }
  };

  const showModal = async () => {
    setVisible(true);
    await handleFindMatches();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type={buttonType}
        icon={<SearchOutlined />}
        onClick={showModal}
      >
        {buttonText}
      </Button>

      <Modal
        title="Potential Matches for Your Journey"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="refresh" onClick={handleFindMatches} loading={loading}>
            Refresh Matches
          </Button>,
          <Button key="close" type="primary" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={900}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Finding the best matches for your journey...</p>
          </div>
        ) : (
          <MatchList
            matches={matches}
            userType="traveler"
            onRefresh={handleFindMatches}
          />
        )}
      </Modal>
    </>
  );
};

export default FindMatchesForJourney; 