import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import SliderMonitor from 'redux-slider-monitor';
import Inspector from 'redux-devtools-inspector';
import DiffMonitor from 'redux-devtools-diff-monitor';
import FilterableLogMonitor from 'redux-devtools-filterable-log-monitor';
import ChartMonitor from 'redux-devtools-chart-monitor';

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-w"
    changeMonitorKey="ctrl-m"
    defaultIsVisible={false}
  >
    <LogMonitor />
    <SliderMonitor />
    <Inspector />
    <DiffMonitor />
    <FilterableLogMonitor />
    <ChartMonitor />
  </DockMonitor>
);
