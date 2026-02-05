'use client';

/* ==========================================================================
   Clients Page
   List and manage all clients
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { clientsData, Client } from '@/data/placeholder';
import { validateClientForm, hasErrors } from '@/utils/validation';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';

// ==========================================================================
// Client Modal Component
// ==========================================================================

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client;
  onSave: (client: Omit<Client, 'id'>) => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, client, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'active' as Client['status'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when client prop changes
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        company: client.company || '',
        phone: client.phone || '',
        status: client.status || 'active',
      });
    } else {
      // Reset form for new client
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        status: 'active',
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateClientForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto animate-in zoom-in-95 duration-300 delay-150 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 pr-2">
            {client ? 'Edit Client' : 'New Client'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {client ? 'Update Client' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// Status Badge Component
// ==========================================================================

const StatusBadge: React.FC<{ status: Client['status'] }> = ({ status }) => {
  const config: Record<Client['status'], { label: string; className: string }> = {
    'active': { label: 'Active', className: 'bg-green-100 text-green-700' },
    'inactive': { label: 'Inactive', className: 'bg-gray-100 text-gray-700' },
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config[status].className}`}>
      {config[status].label}
    </span>
  );
};

// ==========================================================================
// Clients Page Component
// ==========================================================================

export default function ClientsPage() {
  const { showToast } = useToast();
  const { confirm } = useConfirmDialog();
  const [filter, setFilter] = useState<string>('all');
  const [clients, setClients] = useState<Client[]>(clientsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredClients = filter === 'all'
    ? clients
    : clients.filter(c => c.status === filter);

  const handleNewClient = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    setEditingClient(undefined);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    const confirmed = await confirm({
      title: 'Delete Client',
      message: `Are you sure you want to delete "${client?.name}"? This action cannot be undone.`,
      type: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (confirmed) {
      setClients(clients.filter(c => c.id !== clientId));
      showToast({
        type: 'success',
        title: 'Client Deleted',
        message: 'The client has been successfully deleted.',
      });
    }
  };

  const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map(c =>
        c.id === editingClient.id
          ? { ...clientData, id: editingClient.id }
          : c
      ));
      showToast({
        type: 'success',
        title: 'Client Updated',
        message: 'The client has been successfully updated.',
      });
    } else {
      // Add new client
      const newClient: Client = {
        ...clientData,
        id: (clients.length + 1).toString(),
      };
      setClients([...clients, newClient]);
      showToast({
        type: 'success',
        title: 'Client Created',
        message: 'The new client has been successfully created.',
      });
    }
  };

  return (
    <DashboardLayout>
      {/* ==========================================================================
         Page Header
         ========================================================================== */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Clients
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Manage your client relationships and contacts.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Status Filter */}
            <div className="relative min-w-0">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 sm:px-4 sm:py-2.5 sm:pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
              >
                <option value="all">All Clients</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* New Client Button */}
            <button
              onClick={handleNewClient}
              className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all duration-300 shrink-0 ${
                isAnimating ? 'animate-pulse scale-105' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden xs:inline sm:inline">New Client</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         Clients Table
         ========================================================================== */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Contact
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Company
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-medium text-primary">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {client.name}
                        </div>
                        {/* Mobile: Show email and company inline */}
                        <div className="sm:hidden text-xs text-gray-500 mt-1 space-y-1">
                          <div>{client.email}</div>
                          {client.company && <div>{client.company}</div>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    {client.phone && (
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-900">
                      {client.company || '-'}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClient(client);
                        }}
                        className="text-primary hover:text-primary-dark p-1 sm:p-2 rounded-lg hover:bg-primary/5 transition-colors"
                        title="Edit client"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClient(client.id);
                        }}
                        className="text-red-600 hover:text-red-800 p-1 sm:p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete client"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'Get started by creating your first client.' : `No ${filter} clients found.`}
            </p>
            {filter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={handleNewClient}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Client
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==========================================================================
         Client Modal
         ========================================================================== */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={editingClient}
        onSave={handleSaveClient}
      />
    </DashboardLayout>
  );
}