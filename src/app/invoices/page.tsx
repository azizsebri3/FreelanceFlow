'use client';

/* ==========================================================================
   Invoices Page
   List and manage all invoices
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { invoicesData as initialInvoicesData, Invoice, clientsData, WorkItem } from '@/data/placeholder';
import CreateInvoiceModal from '@/components/ui/CreateInvoiceModal';
import { exportInvoiceToPDF } from '@/utils/export';

// ==========================================================================
// Invoices Page Component
// ==========================================================================

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoicesData);
  const [filter, setFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getStatusStyle = (status: Invoice['status']) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700',
    };
    return styles[status];
  };

  const handleCreateInvoice = (invoiceData: {
    client: string;
    workItems: WorkItem[];
    dueDate: string;
    logoUrl?: string;
    notes?: string;
    taxRate?: number;
  }) => {
    const subtotal = invoiceData.workItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * ((invoiceData.taxRate || 0) / 100);
    const totalAmount = subtotal + taxAmount;

    const newInvoice: Invoice = {
      id: (invoices.length + 1).toString(),
      invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      client: invoiceData.client,
      amount: totalAmount,
      status: 'pending',
      dueDate: invoiceData.dueDate,
      issuedDate: new Date().toISOString().split('T')[0],
      workItems: invoiceData.workItems,
      logoUrl: invoiceData.logoUrl,
      notes: invoiceData.notes,
      taxRate: invoiceData.taxRate,
    };

    setInvoices(prev => [...prev, newInvoice]);
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      const result = await exportInvoiceToPDF(invoice);
      if (!result.success) {
        console.error('Failed to download invoice:', result.error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleSendReminder = (invoice: Invoice) => {
    // In a real app, this would send an email reminder
    console.log('Sending reminder for invoice:', invoice.invoiceNumber);
    // You could show a toast notification here
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, status: 'paid' as const }
        : inv
    ));
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    const duplicatedInvoice: Invoice = {
      ...invoice,
      id: (invoices.length + 1).toString(),
      invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      status: 'pending',
      issuedDate: new Date().toISOString().split('T')[0],
    };
    setInvoices(prev => [...prev, duplicatedInvoice]);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
  };

  const toggleDropdown = (invoiceId: string) => {
    setDropdownOpen(dropdownOpen === invoiceId ? null : invoiceId);
  };

  const toggleInvoiceExpansion = (invoiceId: string) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };

  // Stats
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-500 mt-1">Track and manage your invoices</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'paid', 'pending', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Invoices' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleInvoiceExpansion(invoice.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className={`w-4 h-4 transform transition-transform ${
                              expandedInvoice === invoice.id ? 'rotate-90' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{invoice.client}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(invoice.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(invoice.dueDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleSendReminder(invoice)}
                            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Send Reminder"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                        {invoice.status !== 'paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as Paid"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(invoice.id)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="More Options"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          {dropdownOpen === invoice.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleDuplicateInvoice(invoice);
                                    setDropdownOpen(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteInvoice(invoice);
                                    setDropdownOpen(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {expandedInvoice === invoice.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Work Items</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-2 px-2">Description</th>
                                  <th className="text-right py-2 px-2">Qty</th>
                                  <th className="text-right py-2 px-2">Rate</th>
                                  <th className="text-right py-2 px-2">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoice.workItems.map((item) => (
                                  <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-2 px-2">{item.description}</td>
                                    <td className="text-right py-2 px-2">{item.quantity}</td>
                                    <td className="text-right py-2 px-2">${item.rate.toFixed(2)}</td>
                                    <td className="text-right py-2 px-2 font-medium">${item.amount.toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr className="font-medium">
                                  <td colSpan={3} className="text-right py-2 px-2">Subtotal:</td>
                                  <td className="text-right py-2 px-2">${invoice.workItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</td>
                                </tr>
                                {invoice.taxRate && invoice.taxRate > 0 && (
                                  <tr className="font-medium">
                                    <td colSpan={3} className="text-right py-2 px-2">Tax ({invoice.taxRate}%):</td>
                                    <td className="text-right py-2 px-2">${(invoice.workItems.reduce((sum, item) => sum + item.amount, 0) * (invoice.taxRate / 100)).toFixed(2)}</td>
                                  </tr>
                                )}
                                <tr className="font-bold text-primary">
                                  <td colSpan={3} className="text-right py-2 px-2">Total:</td>
                                  <td className="text-right py-2 px-2">${invoice.amount.toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {invoice.notes && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Notes:</h5>
                              <p className="text-sm text-gray-600">{invoice.notes}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateInvoice={handleCreateInvoice}
        clients={clientsData}
      />

      {/* View Invoice Modal */}
      {isViewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invoice {selectedInvoice.invoiceNumber}</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedInvoice.client}</h3>
                    <p className="text-gray-600">Invoice #{selectedInvoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">Issued: {formatDate(selectedInvoice.issuedDate)}</p>
                    <p className="text-sm text-gray-500">Due: {formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(selectedInvoice.status)}`}>
                      {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Work Items */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Work Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Rate</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.workItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{item.description}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-gray-600">${item.rate.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>${selectedInvoice.workItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
                      </div>
                      {selectedInvoice.taxRate && selectedInvoice.taxRate > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Tax ({selectedInvoice.taxRate}%):</span>
                          <span>${(selectedInvoice.workItems.reduce((sum, item) => sum + item.amount, 0) * (selectedInvoice.taxRate / 100)).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-2">
                        <span>Total:</span>
                        <span>${selectedInvoice.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadInvoice(selectedInvoice);
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
