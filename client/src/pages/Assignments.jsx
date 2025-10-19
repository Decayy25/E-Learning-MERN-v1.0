import React from 'react';
import { FileText, Clipboard } from 'lucide-react';

const Assignments = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="mt-2 text-gray-600">Create and manage assignments</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment Management</h3>
        <p className="text-gray-600 mb-4">
          Create assignments, track submissions, and grade student work.
        </p>
        <div className="text-sm text-gray-500">
          Features: Assignment creation, file uploads, submission tracking, grading system
        </div>
      </div>
    </div>
  );
};

export default Assignments;
