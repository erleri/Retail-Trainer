import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, HelpCircle, ArrowLeft } from 'lucide-react';
import { MotionCard } from '../components/ui/modern/MotionCard';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <MotionCard className="bg-white max-w-md w-full p-8 text-center shadow-xl border-slate-100" glass={false}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary"
                >
                    <HelpCircle size={48} />
                </motion.div>

                <h1 className="text-4xl font-black text-slate-900 mb-2">Oops!</h1>
                <h2 className="text-xl font-bold text-slate-600 mb-4">Page Not Found</h2>

                <p className="text-slate-500 mb-8 leading-relaxed">
                    We couldn't find the page you were looking for. It might have been moved or doesn't exist.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold font-display hover:bg-primary-hover shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Go to Home Dashboard
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 px-4 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </MotionCard>
        </div>
    );
}
