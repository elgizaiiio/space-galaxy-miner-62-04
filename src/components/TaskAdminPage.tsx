
import React, { useState } from 'react';
import TaskAdminDashboard from './TaskAdminDashboard';

const PASSWORD = "2085";

const TaskAdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white/90 shadow-xl p-8 flex flex-col items-center w-[320px] gap-5"
          autoComplete="off"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Admin Panel Login
          </h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-md"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            Login
          </button>
          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
        </form>
      </div>
    );
  }

  return <TaskAdminDashboard />;
};

export default TaskAdminPage;
