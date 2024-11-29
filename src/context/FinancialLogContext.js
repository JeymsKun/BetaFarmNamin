import React, { createContext, useState, useContext } from 'react';

const FinancialLogContext = createContext();

export const FinancialLogProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);

    return (
        <FinancialLogContext.Provider value={{ logs, setLogs }}>
            {children}
        </FinancialLogContext.Provider>
    );
};

export const useFinancialLogs = () => {
    return useContext(FinancialLogContext);
};
