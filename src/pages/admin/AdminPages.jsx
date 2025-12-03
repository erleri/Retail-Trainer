import React from 'react';
import UserManagement from './UserManagement';
import ContentManagement from './ContentManagement';

const PlaceholderPage = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
            🚧
        </div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary mt-2">This module is currently under development.</p>
    </div>
);

export { UserManagement, ContentManagement };
export const SalesLabManagement = () => <PlaceholderPage title="Sales Lab Management" />;
export const AIQuality = () => <PlaceholderPage title="AI Quality & Models" />;
export const Analytics = () => <PlaceholderPage title="KPI & Analytics" />;
export const Campaigns = () => <PlaceholderPage title="Notifications & Campaigns" />;
export const Settings = () => <PlaceholderPage title="System Settings" />;
