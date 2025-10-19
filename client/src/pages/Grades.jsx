import React from 'react';
import { GraduationCap, TrendingUp } from 'lucide-react';

const Grades = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
        <p className="mt-2 text-gray-600">Record and manage student grades</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Grade Management</h3>
        <p className="text-gray-600 mb-4">
          Record grades for assignments, exams, and other assessments.
        </p>
        <div className="text-sm text-gray-500">
          Features: Grade recording, grade history, pass/fail tracking, grade analytics
        </div>
      </div>
    </div>
  );
};

export default Grades;
