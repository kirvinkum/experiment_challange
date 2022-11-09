import { createContext, useState } from "react";

const DashboardFilterContext = createContext({});

export const DashboardFilterProvider = ({ children }) => {
    const [dashboardFilter, setDashboardFilter] = useState({});

    return (
        <DashboardFilterContext.Provider value={{ dashboardFilter, setDashboardFilter }}>
            {children}
        </DashboardFilterContext.Provider>
    )
}

export default DashboardFilterContext;