import React from 'react';
import { Setting } from './setting';
import { RadarChart } from './radar_chart';

export const WidgetDeveloperTemplate: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1, overflow: 'auto', padding: '0', height: '100%', overflowX: 'hidden', overflowY: 'hidden' }}><RadarChart /></div>
      <Setting />
    </div>
  );
};
