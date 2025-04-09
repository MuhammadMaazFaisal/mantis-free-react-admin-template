import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import ReceivingDetailsTable from './ReceivingDetailsTable';
import ProcessingOutTable from './ProcessingOutTable';
import ProcessingInTable from './ProcessingInTable';
import ProcessingExpensesTable from './ProcessingExpensesTable';

const TabbedSubTable = ({ tabs, data, isViewMode, initialTab = 0 }) => {
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderTabContent = (tab) => {
    switch (tab.type) {
      case 'receivingDetails':
        return (
          <ReceivingDetailsTable
            details={data[tab.dataKey] || []}
            onChange={() => {}} // No-op for view mode
            isViewMode={isViewMode}
          />
        );
      case 'processingOut':
        return (
          <ProcessingOutTable
            details={data[tab.dataKey] || []}
            onChange={() => {}} // No-op for view mode
            isViewMode={isViewMode}
          />
        );
      case 'processingIn':
        return (
          <ProcessingInTable
            details={data[tab.dataKey] || []}
            onChange={() => {}} // No-op for view mode
            isViewMode={isViewMode}
          />
        );
      case 'processingExpenses':
        return (
          <ProcessingExpensesTable
            details={data[tab.dataKey] || []}
            onChange={() => {}} // No-op for view mode
            isViewMode={isViewMode}
          />
        );
      default:
        return <Typography>No data available for this tab.</Typography>;
    }
  };

  // Safety check for tabs
  if (!tabs || !Array.isArray(tabs) || tabs.length === 0) {
    return (
      <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: 1 }}>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
          No sub-table data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#f9fafb',
        borderRadius: 1,
        border: '1px solid #e8ecef',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          mb: 1,
          borderBottom: '1px solid #e8ecef',
          '& .MuiTab-root': {
            fontSize: '0.8rem',
            textTransform: 'none',
            color: '#64748b',
            padding: '6px 12px',
            minHeight: '36px',
          },
          '& .MuiTab-root.Mui-selected': {
            color: '#1976d2',
            fontWeight: 500,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#1976d2',
            height: '2px',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {tabs[selectedTab] && renderTabContent(tabs[selectedTab])}
    </Box>
  );
};

// Export a utility function to get tab counts
export const getTabCounts = (tabs, data) => {
  if (!tabs || !Array.isArray(tabs)) return [];
  return tabs.map((tab) => {
    switch (tab.type) {
      case 'receivingDetails':
      case 'processingOut':
      case 'processingIn':
      case 'processingExpenses':
        return (data[tab.dataKey] || []).length;
      default:
        return 0;
    }
  });
};

export default TabbedSubTable;