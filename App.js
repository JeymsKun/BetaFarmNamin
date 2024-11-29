import React from 'react';
import AppNav from './src/navigation/AppNav';
import { ScheduleProvider } from './src/context/ScheduleContext'; 
import { FinancialLogProvider  } from './src/context/FinancialLogContext';

export default function App() {
    return (
      <ScheduleProvider>
        <FinancialLogProvider>
          <AppNav />
        </FinancialLogProvider>
      </ScheduleProvider>
    );
}
