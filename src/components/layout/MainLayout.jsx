import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './modern/Sidebar';
import { MobileDock } from './modern/MobileDock';

export default function MainLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Header (Minimal) */}
            <header className="md:hidden sticky top-0 z-30 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200">
                <span className="text-xl font-bold text-slate-900">
                    Retail Trainer
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative h-[calc(100vh-64px)] md:h-screen w-full overflow-hidden">
                {/* Scrollable Container with Mobile Fixes */}
                <div className="h-full w-full overflow-y-auto overflow-x-hidden px-4 pb-24 md:p-8 md:pb-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto min-h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.3, ease: "circOut" }}
                                className="h-full flex flex-col"
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Mobile Dock */}
            <MobileDock />

            {/* Global Clean Background */}
            <div className="fixed inset-0 pointer-events-none -z-20 bg-slate-50" />
        </div>
    );
}
