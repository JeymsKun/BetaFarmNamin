import React from 'react';
import AppNav from './src/navigation/AppNav';
import { ScheduleProvider } from './src/context/ScheduleContext'; 

export default function App() {
    return (
      <ScheduleProvider>
          <AppNav />
      </ScheduleProvider>
    );
}
