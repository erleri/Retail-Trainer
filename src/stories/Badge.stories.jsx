import React from 'react';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Check, AlertTriangle } from 'lucide-react';

export default {
    title: 'UI/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'success', 'warning', 'danger', 'info', 'neutral', 'gold', 'premium', 'shiny'],
        },
        type: {
            control: 'select',
            options: ['soft', 'solid', 'outline'],
        },
    },
};

export const Primary = {
    args: {
        children: 'Primary Badge',
        variant: 'primary',
    },
};

export const Success = {
    args: {
        children: 'Success',
        variant: 'success',
        icon: Check,
    },
};

export const Warning = {
    args: {
        children: 'Warning',
        variant: 'warning',
        icon: AlertTriangle,
    },
};

export const Premium = {
    args: {
        children: 'Premium',
        variant: 'premium',
        icon: Sparkles,
    },
};

export const AllVariants = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
            </div>
            <div className="flex gap-2">
                <Badge variant="info">Info</Badge>
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="gold">Gold</Badge>
                <Badge variant="premium">Premium</Badge>
            </div>
        </div>
    ),
};
