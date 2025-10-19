import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const Attendance = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-2 text-gray-600">Record and track student attendance</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance Management</h3>
        <p className="text-gray-600 mb-4">
          Record daily attendance and track student presence.
        </p>
        <div className="text-sm text-gray-500">
          Features: Daily attendance recording, attendance reports, absence tracking
        </div>
      </div>
    </div>
  );
};

export default Attendance;
