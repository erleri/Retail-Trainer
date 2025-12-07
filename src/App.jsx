import React from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomeDashboard from './pages/HomeDashboard';
import AIChatbot from './pages/AIChatbot';
import SalesLab from './pages/SalesLab';
import FeedbackReport from './pages/FeedbackReport';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import {
  UserManagement, ContentManagement, SalesLabManagement,
  AIQuality, Analytics, Campaigns, Settings,
  ProductCatalogManager, CustomerManager, GamificationManagement,
  QuizModification
} from './pages/admin/AdminPages';

import MyPage from './pages/MyPage';
import AdminConsole from './pages/AdminConsole';

import StudyRoom from './pages/StudyRoom';

import Quiz from './pages/Quiz';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomeDashboard />} />
        <Route path="feedback" element={<FeedbackReport />} />

        <Route path="study" element={<StudyRoom />} />
        <Route path="study/:tabId" element={<StudyRoom />} />
        <Route path="ai-trainer" element={<AIChatbot />} />
        <Route path="sales-lab" element={<SalesLab />} />
        <Route path="my" element={<MyPage />} />
        <Route path="admin-console" element={<AdminConsole />} />
        {/* Redirects for legacy/broken links */}
        <Route path="saleslab" element={<Navigate to="/sales-lab" replace />} />
        <Route path="chatbot" element={<Navigate to="/ai-trainer" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="cms" element={<ContentManagement />} />
        <Route path="sales-lab" element={<SalesLabManagement />} />
        <Route path="ai-quality" element={<AIQuality />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="settings" element={<Settings />} />
        {/* V2 Spec Routes */}
        <Route path="products" element={<ProductCatalogManager />} />
        <Route path="customer" element={<CustomerManager />} />
        <Route path="gamification" element={<GamificationManagement />} />
        <Route path="cms/quiz" element={<QuizModification />} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
