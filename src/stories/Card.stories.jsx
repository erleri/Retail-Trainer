import React from 'react';
import { Card } from '../components/ui/Card';

export default {
    title: 'UI/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['glass', 'panel', 'solid', 'outline', 'flat'],
        },
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg'],
        },
        hover: {
            control: 'boolean',
        },
    },
};

export const Glass = {
    args: {
        children: (
            <div>
                <h3 className="text-lg font-bold mb-2">Glass Card</h3>
                <p className="text-gray-600">This is a glassmorphism style card.</p>
            </div>
        ),
        variant: 'glass',
        className: 'w-80',
    },
};

export const Panel = {
    args: {
        children: (
            <div>
                <h3 className="text-lg font-bold mb-2">Panel Card</h3>
                <p className="text-gray-600">Standard panel style.</p>
            </div>
        ),
        variant: 'panel',
        className: 'w-80',
    },
};

export const Interactive = {
    args: {
        children: (
            <div>
                <h3 className="text-lg font-bold mb-2">Hover Me</h3>
                <p className="text-gray-600">This card has hover effects.</p>
            </div>
        ),
        variant: 'glass',
        hover: true,
        className: 'w-80',
    },
};
