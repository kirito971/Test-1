import React from 'react';
import { AppUser, UserRole } from '../types';
import { MOCK_USERS } from '../mockData';
import { User, CreditCard, Gift, LogOut } from 'lucide-react';

interface ProfileViewProps {
  user: AppUser;
  onSwitchUser: (user: AppUser) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onSwitchUser }) => {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-surface p-6 rounded-lg border border-border flex items-center space-x-4">
        <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center text-gray-500">
            <User size={32} />
        </div>
        <div>
            <h2 className="text-xl font-display font-semibold text-secondary">{user.name}</h2>
            <p className="text-sm text-primary font-medium">{user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-lg border border-border">
             <div className="flex items-center text-gray-500 mb-2">
                 <CreditCard size={18} className="mr-2" />
                 <span className="text-xs font-semibold uppercase tracking-wide">Wallet</span>
             </div>
             <p className="text-xl font-semibold text-secondary">{user.walletBalance.toLocaleString()} XAF</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
             <div className="flex items-center text-gray-500 mb-2">
                 <Gift size={18} className="mr-2" />
                 <span className="text-xs font-semibold uppercase tracking-wide">Rewards</span>
             </div>
             <p className="text-xl font-semibold text-secondary">0 Pts</p>
          </div>
      </div>

      {/* Demo Role Switcher */}
      <div className="bg-secondary text-white p-4 rounded-lg">
          <h3 className="font-semibold text-sm mb-3 text-gray-300 uppercase tracking-wider">Demo: Switch Role</h3>
          <div className="space-y-2">
              {MOCK_USERS.map(u => (
                  <button
                    key={u.uid}
                    onClick={() => onSwitchUser(u)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between transition ${user.uid === u.uid ? 'bg-primary text-white font-medium' : 'hover:bg-white/10 text-gray-300'}`}
                  >
                      <span>{u.name}</span>
                      <span className="text-xs opacity-75">{u.role}</span>
                  </button>
              ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Switch roles to experience the "Cash & Trust" workflow from different perspectives (Wholesaler assigns driver, Driver uploads video, Client pays).
          </p>
      </div>

      <button className="w-full flex items-center justify-center space-x-2 text-red-600 py-3 font-medium hover:bg-red-50 rounded-md transition">
          <LogOut size={18} />
          <span>Log Out</span>
      </button>
    </div>
  );
};