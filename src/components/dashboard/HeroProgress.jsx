import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export const HeroProgress = ({ level, xpPercentage }) => {
    const xpChartData = [{ name: 'XP', value: xpPercentage, fill: '#4F46E5' }];

    return (
        <div className="relative h-32 w-32 md:h-40 md:w-40 flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    innerRadius="80%" outerRadius="100%"
                    barSize={10} data={xpChartData}
                    startAngle={90} endAngle={-270}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: '#e2e8f0' }} clockWise dataKey="value" cornerRadius={10} fill="#4F46E5" />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{level}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LVL</span>
            </div>
        </div>
    );
};
