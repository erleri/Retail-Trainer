import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import SalesLabSetup from '../components/sales-lab/SalesLabSetup';
import SalesLabChat from '../components/sales-lab/SalesLabChat';
import SalesLabFeedback from '../components/sales-lab/SalesLabFeedback';
import SalesLabHistory from '../components/sales-lab/SalesLabHistory';
import { useChatStore } from '../store/chatStore';

export default function SalesLab() {
    const [phase, setPhase] = useState('SETUP'); // SETUP, ROLEPLAY, FEEDBACK, HISTORY
    const [sessionConfig, setSessionConfig] = useState(null);
    const [savedSession, setSavedSession] = useState(null);
    const [sessionResult, setSessionResult] = useState(null);
    const { sessions, addSession } = useChatStore();

    const handleStartRoleplay = (config, savedData = null) => {
        setSessionConfig(config);
        setSavedSession(savedData);
        setPhase('ROLEPLAY');
    };

    const handleEndSession = (result) => {
        // Clear saved session on successful completion
        if (result) {
            localStorage.removeItem('salesLab_savedSession');
        }

        const sessionWithDate = { ...result, id: Date.now(), date: new Date().toISOString() };
        setSessionResult(sessionWithDate);
        addSession(sessionWithDate);
        setPhase('FEEDBACK');
    };

    const handleBackToSetup = () => {
        setPhase('SETUP');
        setSessionConfig(null);
        setSavedSession(null);
        setSessionResult(null);
    };

    const handleViewSession = (sessionId) => {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setSessionResult(session);
            setPhase('FEEDBACK');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <AnimatePresence mode="wait">
                {phase === 'SETUP' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full"
                    >
                        <SalesLabSetup
                            onStart={handleStartRoleplay}
                            onViewHistory={() => setPhase('HISTORY')}
                        />
                    </motion.div>
                )}

                {phase === 'ROLEPLAY' && (
                    <motion.div
                        key="roleplay"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="h-full"
                    >
                        <SalesLabChat
                            config={sessionConfig}
                            initialState={savedSession}
                            onEnd={handleEndSession}
                            onBack={() => setPhase('SETUP')}
                        />
                    </motion.div>
                )}

                {phase === 'FEEDBACK' && (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full"
                    >
                        <SalesLabFeedback
                            feedback={sessionResult}
                            onRestart={handleBackToSetup}
                            onBack={handleBackToSetup}
                            onViewHistory={() => setPhase('HISTORY')}
                        />
                    </motion.div>
                )}

                {phase === 'HISTORY' && (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full"
                    >
                        <SalesLabHistory
                            onBack={() => setPhase('SETUP')}
                            onSelectSession={handleViewSession}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
