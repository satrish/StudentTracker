import { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

// Add or edit users here: { username: 'password' }
const USERS: Record<string, string> = {
  admin: 'starchart',
  sathya: 'mypassword',
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    if (USERS[username.toLowerCase()] === password) {
      setError('');
      onLogin(username.trim());
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #EDE9FE, #FCE7F3, #FEF3C7)' }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div
          className="px-8 py-7 text-center"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899, #F59E0B)' }}
        >
          <div className="text-4xl mb-2">⭐</div>
          <h1 className="text-white text-2xl font-black tracking-tight">Starchart</h1>
          <p className="text-white/80 text-sm mt-1">Kids Daily Tracker</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-semibold text-gray-600">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center -mt-1">{error}</p>
          )}

          <button
            type="submit"
            className="mt-1 py-2.5 rounded-xl text-white font-bold text-sm cursor-pointer transition hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
