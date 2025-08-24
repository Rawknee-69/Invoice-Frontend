import React, { useState, useEffect } from 'react';
import { ReportSkeleton } from '@/skletons';

const Reports = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for demo
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <ReportSkeleton />;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                    Comprehensive insights into your business performance
                </p>
            </div>
            
            <div className="text-center py-12">
                <div className="text-muted-foreground mb-2">Reports coming soon</div>
                <div className="text-sm text-muted-foreground">
                    Advanced analytics and reporting features are under development
                </div>
            </div>
        </div>
    );
};

export default Reports;