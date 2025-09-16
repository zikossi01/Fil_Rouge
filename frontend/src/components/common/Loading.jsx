import React from 'react';

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
  </div>
);

export default Loading;