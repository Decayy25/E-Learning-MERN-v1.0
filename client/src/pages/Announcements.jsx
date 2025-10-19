import React from 'react';
import { Bell, Megaphone } from 'lucide-react';

const Announcements = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <p className="mt-2 text-gray-600">Create and manage announcements</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Announcement Center</h3>
        <p className="text-gray-600 mb-4">
          Create announcements for students, teachers, or specific groups.
        </p>
        <div className="text-sm text-gray-500">
          Features: Create announcements, target specific audiences, priority levels, attachments
        </div>
      </div>
    </div>
  );
};

export default Announcements;
