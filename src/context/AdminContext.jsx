import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [scope, setScope] = useState('GLOBAL'); // GLOBAL, REGION, COUNTRY, BRANCH

    return (
        <AdminContext.Provider value={{ scope, setScope }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within an AdminProvider');
    }
    return context;
};
