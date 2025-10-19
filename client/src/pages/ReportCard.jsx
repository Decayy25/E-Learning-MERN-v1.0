import React from 'react';
import { GraduationCap, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const ReportCard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report Card</h1>
        <p className="mt-2 text-gray-600">View your academic performance</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Academic Report</h3>
        <p className="text-gray-600 mb-4">
          View your grades, assignments, and academic progress.
        </p>
        <div className="text-sm text-gray-500">
          Features: Grade history, assignment status, pass/fail indicators, academic analytics
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
