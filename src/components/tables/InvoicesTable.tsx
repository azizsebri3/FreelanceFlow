'use client';

/* ==========================================================================
   InvoicesTable Component
   Displays recent invoices with status, amounts, and quick actions
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { Invoice, invoicesData } from '@/data/placeholder';
import { exportInvoiceToPDF } from '@/utils/export';

// ==========================================================================
// Status Badge Component
// ==========================================================================

interface StatusBadgeProps {
  status: Invoice['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<Invoice['status'], { label: string; className: string }> = {
    'paid': { label: 'Paid', className: 'badge-success' },
    'pending': { label: 'Pending', className: 'badge-warning' },
    'overdue': { label: 'Overdue', className: 'badge-danger' },
  };

  const config = statusConfig[status];

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
};

// ==========================================================================
// InvoicesTable Component
// ==========================================================================

interface InvoicesTableProps {
  filter: 'all' | 'paid' | 'pending' | 'overdue';
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ filter }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreOptions && !(event.target as Element).closest('.relative')) {
        setShowMoreOptions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreOptions]);
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if invoice is overdue
  const isOverdue = (dueDate: string, status: Invoice['status']) => {
    if (status === 'paid') return false;
    return new Date(dueDate) < new Date();
  };

  // Filter invoices based on the filter prop
  const filteredInvoices = invoicesData.filter((invoice) => {
    switch (filter) {
      case 'paid':
        return invoice.status === 'paid';
      case 'pending':
        return invoice.status === 'pending';
      case 'overdue':
        return isOverdue(invoice.dueDate, invoice.status);
      default:
        return true;
    }
  });

  // Handle PDF download for specific invoice
  const handleDownloadPDF = async (invoice: Invoice) => {
    setIsDownloadingPDF(true);
    try {
      const result = await exportInvoiceToPDF(invoice);
      if (result.success) {
        // PDF download initiated successfully
        console.log('PDF downloaded successfully:', result.filename);
      } else {
        console.error('PDF download failed:', result.error);
        alert('Failed to download PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('An error occurred while downloading the PDF.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Handle send reminder
  const handleSendReminder = (invoice: Invoice) => {
    // In a real app, this would send an email
    alert(`Reminder sent to ${invoice.client} for invoice ${invoice.invoiceNumber}`);
    console.log('Sending reminder for invoice:', invoice.invoiceNumber);
  };

  // Handle mark as paid
  const handleMarkAsPaid = (invoice: Invoice) => {
    // In a real app, this would update the database
    const confirmPaid = window.confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`);
    if (confirmPaid) {
      alert(`Invoice ${invoice.invoiceNumber} marked as paid!`);
      console.log('Marking invoice as paid:', invoice.invoiceNumber);
      // Here you would typically update the invoice status in your state/database
    }
  };

  // Handle more options toggle
  const toggleMoreOptions = (invoiceId: string) => {
    setShowMoreOptions(showMoreOptions === invoiceId ? null : invoiceId);
  };

  // Handle duplicate invoice
  const handleDuplicateInvoice = (invoice: Invoice) => {
    alert(`Duplicate invoice ${invoice.invoiceNumber} created!`);
    console.log('Duplicating invoice:', invoice.invoiceNumber);
    setShowMoreOptions(null);
  };

  // Handle delete invoice
  const handleDeleteInvoice = (invoice: Invoice) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`);
    if (confirmDelete) {
      alert(`Invoice ${invoice.invoiceNumber} deleted!`);
      console.log('Deleting invoice:', invoice.invoiceNumber);
      setShowMoreOptions(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* ==========================================================================
         Table Header
         ========================================================================== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        <div className="flex items-center gap-3">
          {/* Create Invoice Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Invoice</span>
          </button>
          <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
            View All
          </button>
        </div>
      </div>

      {/* ==========================================================================
         Table Content
         ========================================================================== */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Head */}
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Client
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Amount
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                Due Date
              </th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="table-row hover:bg-gray-50 transition-colors"
              >
                {/* Invoice Number */}
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Invoice Icon */}
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${invoice.status === 'paid' ? 'bg-green-100' : 
                        invoice.status === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'}
                    `}>
                      <svg 
                        className={`w-4 h-4 sm:w-5 sm:h-5 
                          ${invoice.status === 'paid' ? 'text-green-600' : 
                            invoice.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'}
                        `} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-gray-900 text-sm sm:text-base block truncate">
                        {invoice.invoiceNumber}
                      </span>
                      {/* Mobile: Show client and amount inline */}
                      <div className="sm:hidden text-xs text-gray-500 mt-1 space-y-1">
                        <div>{invoice.client}</div>
                        <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Client */}
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <span className="text-gray-600 text-sm">{invoice.client}</span>
                </td>

                {/* Amount */}
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <span className="font-semibold text-gray-900 text-sm">
                    {formatCurrency(invoice.amount)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <StatusBadge status={invoice.status} />
                </td>

                {/* Due Date */}
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                  <span className={`text-sm
                    ${isOverdue(invoice.dueDate, invoice.status) ? 'text-red-600 font-medium' : 'text-gray-600'}
                  `}>
                    {formatDate(invoice.dueDate)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowViewModal(true);
                      }}
                      className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View invoice details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadPDF(invoice)}
                      disabled={isDownloadingPDF}
                      className="p-1.5 sm:p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download invoice PDF"
                    >
                      {isDownloadingPDF ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                    </button>

                    {/* Send Reminder Button - Only for pending/overdue */}
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => handleSendReminder(invoice)}
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors hidden sm:block"
                        title="Send payment reminder"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}

                    {/* Mark as Paid Button - Only for pending/overdue */}
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => handleMarkAsPaid(invoice)}
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors hidden md:block"
                        title="Mark as paid"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}

                    {/* More Options Button */}
                    <div className="relative">
                      <button
                        onClick={() => toggleMoreOptions(invoice.id)}
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More options"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {showMoreOptions === invoice.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleDuplicateInvoice(invoice)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Duplicate Invoice
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Invoice
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==========================================================================
         Table Footer - Summary
         ========================================================================== */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-sm text-gray-500">Total Outstanding:</span>
            <span className="ml-2 text-lg font-bold text-gray-900">
              {formatCurrency(
                filteredInvoices
                  .filter(inv => inv.status !== 'paid')
                  .reduce((sum, inv) => sum + inv.amount, 0)
              )}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Overdue:</span>
            <span className="ml-2 text-lg font-bold text-red-600">
              {formatCurrency(
                filteredInvoices
                  .filter(inv => isOverdue(inv.dueDate, inv.status))
                  .reduce((sum, inv) => sum + inv.amount, 0)
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* ==========================================================================
         Invoice View Modal
         ========================================================================== */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
                <p className="text-sm text-gray-600 mt-1">Invoice #{selectedInvoice.invoiceNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedInvoice.status} />
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Invoice Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Invoice #:</span> {selectedInvoice.invoiceNumber}</p>
                      <p><span className="font-medium">Date:</span> {formatDate(selectedInvoice.issuedDate)}</p>
                      <p><span className="font-medium">Due Date:</span> {formatDate(selectedInvoice.dueDate)}</p>
                    </div>
                  </div>
                  {selectedInvoice.logoUrl && (
                    <div className="w-20 h-20 border rounded-lg overflow-hidden bg-white">
                      <img src={selectedInvoice.logoUrl} alt="Company logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
                    <div className="text-gray-700">
                      <p className="font-medium text-lg">{selectedInvoice.client}</p>
                      <p className="text-sm text-gray-500 mt-1">Client details</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">From:</h3>
                    <div className="text-gray-700">
                      <p className="font-medium text-lg">Your Company Name</p>
                      <p className="text-sm text-gray-500 mt-1">Your business details</p>
                    </div>
                  </div>
                </div>

                {/* Work Items Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Qty</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Rate</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.workItems?.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">${item.rate.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Subtotal:</td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                          ${selectedInvoice.workItems?.reduce((sum, item) => sum + item.amount, 0).toFixed(2) || '0.00'}
                        </td>
                      </tr>
                      {selectedInvoice.taxRate && selectedInvoice.taxRate > 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                            Tax ({selectedInvoice.taxRate}%):
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                            ${((selectedInvoice.workItems?.reduce((sum, item) => sum + item.amount, 0) || 0) * (selectedInvoice.taxRate / 100)).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-gray-300">
                        <td colSpan={3} className="px-6 py-4 text-right text-lg font-bold text-gray-900">Total:</td>
                        <td className="px-6 py-4 text-right text-lg font-bold text-primary">
                          ${selectedInvoice.amount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes & Payment Terms:</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedInvoice.notes}
                    </div>
                  </div>
                )}

                {/* Status and Payment Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Status: </span>
                      <StatusBadge status={selectedInvoice.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {selectedInvoice.status === 'paid' ? 'Paid on: ' + formatDate(selectedInvoice.issuedDate) :
                         isOverdue(selectedInvoice.dueDate, selectedInvoice.status) ? 'Overdue by: ' +
                         Math.ceil((new Date().getTime() - new Date(selectedInvoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)) + ' days' :
                         'Due in: ' + Math.ceil((new Date(selectedInvoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + ' days'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Message */}
                <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
                  <p>Thank you for your business! Payment is due within {Math.ceil((new Date(selectedInvoice.dueDate).getTime() - new Date(selectedInvoice.issuedDate).getTime()) / (1000 * 60 * 60 * 24))} days.</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedInvoice(null);
                }}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedInvoice!)}
                disabled={isDownloadingPDF}
                className="px-6 py-3 text-sm font-medium text-primary bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloadingPDF ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesTable;
