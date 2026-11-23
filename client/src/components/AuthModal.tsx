import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, BloodGroup } from '../types';
import { X, Lock, Mail, User, Phone, MapPin, Building2, Heart, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialRole = 'donor', onSuccess }) => {
  const { loginAs } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [city, setCity] = useState('New Delhi');
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setMessage(`A password reset link with 2FA instructions has been dispatched to ${email || 'your email'}.`);
      return;
    }

    loginAs(role);
    onSuccess(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 mb-3 shadow-xs">
            <Heart className="w-6 h-6 fill-red-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {mode === 'login' && 'Sign In to BloodConnect AI'}
            {mode === 'register' && `Register as ${role.replace('_', ' ')}`}
            {mode === 'forgot' && 'Reset Your Security Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' && 'Select your role to access your dedicated clinical console'}
            {mode === 'register' && 'Join the coordinated blood network'}
            {mode === 'forgot' && 'Enter your registered email address to receive recovery instructions'}
          </p>
        </div>

        {/* Role Selector Tabs (Only in Login & Register) */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5 text-xs font-semibold">
            {(['donor', 'hospital', 'blood_bank', 'admin'] as UserRole[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-1.5 rounded-lg capitalize transition-all ${
                  role === r
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {r === 'blood_bank' ? 'Blood Bank' : r}
              </button>
            ))}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / Entity Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={role === 'donor' ? 'e.g. Rahul Sharma' : 'e.g. Apollo Metro Bank'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {role === 'donor' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold text-red-600"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. New Delhi"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'director@bloodconnect.ai' : 'user@healthcare.org'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setMessage(null); }}
                    className="text-[11px] text-red-600 dark:text-red-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer mt-2"
          >
            {mode === 'login' && `Sign In as ${role.replace('_', ' ')}`}
            {mode === 'register' && `Create ${role.replace('_', ' ')} Account`}
            {mode === 'forgot' && 'Send Security Reset Link'}
          </button>
        </form>

        {/* Bottom Switcher */}
        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('register'); setMessage(null); }}
                className="text-red-600 dark:text-red-400 font-bold hover:underline"
              >
                Register Here
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Already registered?{' '}
              <button
                onClick={() => { setMode('login'); setMessage(null); }}
                className="text-red-600 dark:text-red-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button
              onClick={() => { setMode('login'); setMessage(null); }}
              className="text-red-600 dark:text-red-400 font-bold hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
