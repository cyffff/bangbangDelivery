import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Divider, Tag, Switch } from 'antd';

const { Title, Text, Paragraph } = Typography;

interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  success: boolean;
  duration: number;
  requestData?: any;
  responseData?: any;
  error?: string;
}

const DebugPanel: React.FC = () => {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Function to intercept fetch calls
    const originalFetch = window.fetch;
    
    window.fetch = async (input, init) => {
      if (!isEnabled) return originalFetch(input, init);
      
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : 'unknown';
      const method = init?.method || (input instanceof Request ? input.method : 'GET');
      const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();
      
      let requestData;
      try {
        if (init?.body) {
          requestData = JSON.parse(init.body.toString());
        } else if (input instanceof Request && input.body) {
          const bodyClone = await new Response(input.body).text();
          try {
            requestData = JSON.parse(bodyClone);
          } catch (e) {
            requestData = bodyClone;
          }
        }
      } catch (e) {
        requestData = 'Could not parse request body';
      }
      
      // Create initial log entry
      const initialLog: RequestLog = {
        id: requestId,
        timestamp: new Date().toISOString(),
        method,
        url,
        success: false,
        duration: 0,
        requestData
      };
      
      setLogs(prev => [initialLog, ...prev.slice(0, 19)]);
      
      try {
        const response = await originalFetch(input, init);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Clone the response so we can read the body
        const clonedResponse = response.clone();
        let responseData;
        
        try {
          if (response.headers.get('content-type')?.includes('application/json')) {
            responseData = await clonedResponse.json();
          } else {
            responseData = await clonedResponse.text();
          }
        } catch (e) {
          responseData = 'Could not parse response';
        }
        
        // Update log with response data
        setLogs(prev => prev.map(log => 
          log.id === requestId 
            ? { 
                ...log, 
                success: response.ok, 
                status: response.status, 
                duration, 
                responseData 
              } 
            : log
        ));
        
        return response;
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Update log with error
        setLogs(prev => prev.map(log => 
          log.id === requestId 
            ? { 
                ...log, 
                success: false, 
                duration, 
                error: error instanceof Error ? error.message : String(error) 
              } 
            : log
        ));
        
        throw error;
      }
    };
    
    // Add axios interceptor if available
    if (window.axios) {
      const axiosInterceptor = window.axios.interceptors.request.use(
        // Request interceptor
        config => {
          if (!isEnabled) return config;
          
          const requestId = `axios-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          config.metadata = { 
            requestId,
            startTime: Date.now() 
          };
          
          const initialLog: RequestLog = {
            id: requestId,
            timestamp: new Date().toISOString(),
            method: config.method?.toUpperCase() || 'UNKNOWN',
            url: config.url || 'unknown',
            success: false,
            duration: 0,
            requestData: config.data
          };
          
          setLogs(prev => [initialLog, ...prev.slice(0, 19)]);
          
          return config;
        }
      );
      
      const axiosResponseInterceptor = window.axios.interceptors.response.use(
        // Success handler
        response => {
          if (!isEnabled) return response;
          
          const { requestId, startTime } = response.config.metadata || {};
          
          if (requestId) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            setLogs(prev => prev.map(log => 
              log.id === requestId 
                ? { 
                    ...log, 
                    success: true, 
                    status: response.status, 
                    duration, 
                    responseData: response.data 
                  } 
                : log
            ));
          }
          
          return response;
        },
        // Error handler
        error => {
          if (!isEnabled) return Promise.reject(error);
          
          const { requestId, startTime } = error.config?.metadata || {};
          
          if (requestId) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            setLogs(prev => prev.map(log => 
              log.id === requestId 
                ? { 
                    ...log, 
                    success: false, 
                    status: error.response?.status, 
                    duration, 
                    responseData: error.response?.data,
                    error: error.message 
                  } 
                : log
            ));
          }
          
          return Promise.reject(error);
        }
      );
      
      return () => {
        // Clean up interceptors
        window.axios.interceptors.request.eject(axiosInterceptor);
        window.axios.interceptors.response.eject(axiosResponseInterceptor);
      };
    }
    
    return () => {
      // Restore original fetch
      window.fetch = originalFetch;
    };
  }, [isEnabled]);
  
  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  if (!isEnabled && logs.length === 0) {
    return null;
  }
  
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, width: '500px', maxHeight: '500px', overflowY: 'auto', zIndex: 1000, padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', borderTopLeftRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Title level={5} style={{ margin: 0 }}>Network Request Debug</Title>
        <Space>
          <Switch 
            checked={isEnabled} 
            onChange={setIsEnabled} 
            size="small" 
            checkedChildren="On" 
            unCheckedChildren="Off"
          />
          <Button size="small" onClick={clearLogs} disabled={logs.length === 0}>
            Clear
          </Button>
        </Space>
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      
      {logs.length === 0 ? (
        <Text type="secondary">No requests logged yet</Text>
      ) : (
        <div>
          {logs.map((log) => (
            <Card 
              key={log.id} 
              size="small" 
              style={{ 
                marginBottom: '8px', 
                borderLeft: `4px solid ${log.success ? '#52c41a' : log.status === undefined ? '#faad14' : '#f5222d'}`
              }}
              onClick={() => toggleExpanded(log.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <Space>
                  <Tag color={methodColor(log.method)}>{log.method}</Tag>
                  <Text ellipsis style={{ maxWidth: '200px' }}>{log.url}</Text>
                </Space>
                <Space>
                  {log.status && (
                    <Tag color={statusColor(log.status)}>{log.status}</Tag>
                  )}
                  <Text type="secondary">{log.duration}ms</Text>
                </Space>
              </div>
              
              {expanded[log.id] && (
                <div style={{ marginTop: '8px' }}>
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div>
                    <Text strong>Request:</Text>
                    <Paragraph 
                      style={{ 
                        background: '#f5f5f5', 
                        padding: '8px', 
                        borderRadius: '4px',
                        maxHeight: '100px',
                        overflowY: 'auto',
                        marginTop: '4px'
                      }}
                    >
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {log.requestData ? JSON.stringify(log.requestData, null, 2) : 'No request data'}
                      </pre>
                    </Paragraph>
                  </div>
                  
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>Response:</Text>
                    <Paragraph 
                      style={{ 
                        background: '#f5f5f5', 
                        padding: '8px', 
                        borderRadius: '4px',
                        maxHeight: '100px',
                        overflowY: 'auto',
                        marginTop: '4px'
                      }}
                    >
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {log.error 
                          ? <Text type="danger">{log.error}</Text>
                          : log.responseData 
                            ? typeof log.responseData === 'string' 
                              ? log.responseData 
                              : JSON.stringify(log.responseData, null, 2) 
                            : 'No response data yet'}
                      </pre>
                    </Paragraph>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper functions for colors
const methodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET': return 'blue';
    case 'POST': return 'green';
    case 'PUT': return 'orange';
    case 'DELETE': return 'red';
    case 'PATCH': return 'purple';
    case 'OPTIONS': return 'cyan';
    default: return 'default';
  }
};

const statusColor = (status: number) => {
  if (status < 300) return 'green';
  if (status < 400) return 'blue';
  if (status < 500) return 'orange';
  return 'red';
};

// Declare window.axios to avoid TypeScript errors
declare global {
  interface Window {
    axios: any;
  }
}

export default DebugPanel; 