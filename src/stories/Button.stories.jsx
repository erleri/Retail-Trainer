import React from 'react';
import { Button } from '../components/ui/Button';
import { Mail, ArrowRight, Trash2 } from 'lucide-react';

export default {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'glass'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'icon'],
        },
        disabled: {
            control: 'boolean',
        },
    },
};

export const Primary = {
    args: {
        children: 'Primary Button',
        variant: 'primary',
    },
};

export const Secondary = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
    },
};

export const WithIcon = {
    args: {
        children: 'Send Email',
        icon: Mail,
        variant: 'primary',
    },
};

export const Danger = {
    args: {
        children: 'Delete',
        variant: 'danger',
        icon: Trash2,
    },
};

export const Glass = {
    args: {
        children: 'Glass Button',
        variant: 'glass',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};
