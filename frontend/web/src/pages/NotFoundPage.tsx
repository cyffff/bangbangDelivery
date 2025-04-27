import React from 'react';
import { Result, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('error.pageNotFound') || "Sorry, the page you visited does not exist."}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('common.backHome') || "Back Home"}
        </Button>
      }
    />
  );
};

export default NotFoundPage; 