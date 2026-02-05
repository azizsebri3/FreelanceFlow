'use client';

/* ==========================================================================
   Settings Page
   Account and application settings
   ========================================================================== */

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// ==========================================================================
// Settings Page Component
// ==========================================================================

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '🔐' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-1 sm:p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-colors text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="font-medium truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Profile Information</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Update your personal information</p>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                    JD
                  </div>
                  <div className="text-center sm:text-left">
                    <button className="px-3 sm:px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" defaultValue="John" className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" defaultValue="john@freelanceflow.com" className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea rows={3} defaultValue="Full-stack developer specializing in web and mobile applications." className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-sm sm:text-base" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Password */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Change Password</h2>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input type="password" className="w-full max-w-md px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input type="password" className="w-full max-w-md px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input type="password" className="w-full max-w-md px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base" />
                  </div>
                  <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base font-medium">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg border border-red-200">
                <div className="p-4 sm:p-6 border-b border-red-200">
                  <h2 className="text-base sm:text-lg font-semibold text-red-600">Danger Zone</h2>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Notification Preferences</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {[
                  { label: 'Email notifications', desc: 'Receive email updates about your account' },
                  { label: 'Project updates', desc: 'Get notified when project status changes' },
                  { label: 'Invoice reminders', desc: 'Receive reminders for pending invoices' },
                  { label: 'New messages', desc: 'Get notified about new client messages' },
                  { label: 'Marketing emails', desc: 'Receive tips and product updates' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{item.label}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" defaultChecked={i < 4} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Current Plan</h2>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Pro Plan</p>
                      <p className="text-xs sm:text-sm text-gray-500">Full access to all features</p>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium self-start sm:self-center">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Payment Method</h2>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-gray-500 text-sm sm:text-base">No payment method added yet.</p>
                  <button className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    Add Payment Method
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Connected Apps</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {[
                  { name: 'Google Calendar', desc: 'Sync your schedule', connected: true },
                  { name: 'Slack', desc: 'Get notifications in Slack', connected: false },
                  { name: 'Stripe', desc: 'Accept payments', connected: true },
                  { name: 'QuickBooks', desc: 'Sync invoices', connected: false },
                ].map((app, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                        {app.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{app.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{app.desc}</p>
                      </div>
                    </div>
                    <button className={`px-3 sm:px-4 py-2 rounded-lg text-sm transition-colors flex-shrink-0 ${
                      app.connected
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}>
                      {app.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
