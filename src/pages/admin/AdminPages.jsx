import UserManagement from './UserManagement';
import ScenarioManagement from './ScenarioManagement';
import SystemSettings from './SystemSettings';
import ProductCatalogManager from './ProductCatalogManager';
import CustomerManager from './CustomerManager';
import GamificationManager from './GamificationManager';
import ContentManager from './ContentManager';
import QuizBuilder from './QuizBuilder';
import PerformanceMonitor from './PerformanceMonitor';
import InsightsConsole from './InsightsConsole';

const PlaceholderPage = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
            🚧
        </div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary mt-2">This module is currently under development.</p>
    </div>
);

export { UserManagement };
export const SalesLabManagement = ScenarioManagement;
export const Settings = SystemSettings;
export const Campaigns = () => <PlaceholderPage title="Notifications & Campaigns" />;

// New V2 Spec Placeholders
export { ProductCatalogManager, CustomerManager };
export const GamificationManagement = GamificationManager;
export const ContentManagement = ContentManager;
export const QuizModification = QuizBuilder;
export const AIQuality = PerformanceMonitor;
export const Analytics = InsightsConsole;
