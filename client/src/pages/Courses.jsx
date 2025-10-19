import React from 'react';
import { BookOpen, Users, Calendar } from 'lucide-react';

const Courses = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <p className="mt-2 text-gray-600">Manage courses and enrollments</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course Management</h3>
        <p className="text-gray-600 mb-4">
          Create, edit, and manage courses. Enroll students and assign teachers.
        </p>
        <div className="text-sm text-gray-500">
          Features: Course creation, student enrollment, teacher assignment, schedule management
        </div>
      </div>
    </div>
  );
};

export default Courses;
