import { createContext, useContext, useState } from 'react';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
    const [schedules, setSchedules] = useState([]);

    return (
        <ScheduleContext.Provider value={{ schedules, setSchedules }}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedules = () => useContext(ScheduleContext);
