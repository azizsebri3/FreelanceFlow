'use client';

/* ==========================================================================
   Create Invoice Modal
   Modal component for creating new invoices
   ========================================================================== */

import React, { useState } from 'react';
import { Client } from '@/data/placeholder';
import WorkItemsManager, { WorkItem } from './WorkItemsManager';
import LogoUpload from './LogoUpload';
import { exportInvoiceToPDF } from '@/utils/export';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (invoice: {
    client: string;
    workItems: WorkItem[];
    dueDate: string;
    logoUrl?: string;
    notes?: string;
    taxRate?: number;
  }) => void;
  clients: Client[];
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  onCreateInvoice,
  clients
}: CreateInvoiceModalProps) {
  const [formData, setFormData] = useState({
    client: '',
    dueDate: '',
    workItems: [] as WorkItem[],
    logoUrl: undefined as string | undefined,
    notes: '',
    taxRate: 8, // Default 8%
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (formData.workItems.length === 0) {
      newErrors.workItems = 'At least one work item is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const totalAmount = formData.workItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = totalAmount * (formData.taxRate / 100);
    const finalAmount = totalAmount + taxAmount;

    onCreateInvoice({
      client: formData.client,
      workItems: formData.workItems,
      dueDate: formData.dueDate,
      logoUrl: formData.logoUrl,
      notes: formData.notes || undefined,
      taxRate: formData.taxRate,
    });

    // Reset form
    setFormData({
      client: '',
      dueDate: '',
      workItems: [],
      logoUrl: undefined,
      notes: '',
      taxRate: 8,
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      client: '',
      dueDate: '',
      workItems: [],
      logoUrl: undefined,
      notes: '',
      taxRate: 8,
    });
    setErrors({});
    onClose();
  };

  // Handle PDF download for preview
  const handlePreviewDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const invoiceData = {
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        client: formData.client,
        amount: formData.workItems.reduce((sum, item) => sum + item.amount, 0) * (1 + formData.taxRate / 100),
        status: 'pending' as const,
        dueDate: formData.dueDate,
        issuedDate: new Date().toISOString().split('T')[0],
        workItems: formData.workItems,
        logoUrl: formData.logoUrl,
        notes: formData.notes,
        taxRate: formData.taxRate,
      };

      const result = await exportInvoiceToPDF(invoiceData);
      if (result.success) {
        console.log('Preview PDF downloaded successfully:', result.filename);
      } else {
        console.error('Preview PDF download failed:', result.error);
        alert('Failed to download PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading preview PDF:', error);
      alert('An error occurred while downloading the PDF.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
            <p className="text-sm text-gray-600 mt-1">Fill in the details to generate a professional invoice</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Client and Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Client Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client *
                    </label>
                    <select
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                        errors.client ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary/50'
                      }`}
                    >
                      <option value="">Select a client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.name}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {errors.client && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.client}
                      </p>
                    )}
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                        errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary/50'
                      }`}
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.dueDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Work Items Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-9">
                    <h4 className="text-lg font-semibold text-gray-900">Work Items</h4>
                    <span className="text-sm text-gray-500">
                      {formData.workItems.length} item{formData.workItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <WorkItemsManager
                    workItems={formData.workItems}
                    onChange={(workItems) => setFormData({ ...formData, workItems })}
                  />
                  {errors.workItems && (
                    <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.workItems}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes & Payment Terms
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add payment terms, notes, or additional information..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/50 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Right Column - Settings & Preview */}
              <div className="space-y-6 lg:ml-20">
                {/* Invoice Settings */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Invoice Settings</h4>

                  {/* Tax Rate */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/50 transition-all"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Logo
                    </label>
                    <LogoUpload
                      logoUrl={formData.logoUrl}
                      onLogoChange={(logoUrl) => setFormData({ ...formData, logoUrl })}
                    />
                  </div>
                </div>

                {/* Invoice Preview */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Items:</span>
                      <span className="font-medium">{formData.workItems.length}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="font-medium">${formData.workItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
                    </div>

                    {formData.taxRate > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tax ({formData.taxRate}%):</span>
                        <span className="font-medium">
                          ${(formData.workItems.reduce((sum, item) => sum + item.amount, 0) * (formData.taxRate / 100)).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <hr className="border-gray-300" />

                    <div className="flex justify-between items-center text-lg font-bold text-green-700">
                      <span>Total:</span>
                      <span>
                        ${(
                          formData.workItems.reduce((sum, item) => sum + item.amount, 0) *
                          (1 + formData.taxRate / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Fields marked with * are required
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  disabled={formData.workItems.length === 0}
                  className="px-6 py-3 text-sm font-medium text-primary bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview Invoice
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg hover:shadow-xl"
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Invoice Preview</h3>
                <p className="text-sm text-gray-600 mt-1">Review your invoice before creating</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Invoice Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Invoice #:</span> INV-{Date.now().toString().slice(-6)}</p>
                      <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                      <p><span className="font-medium">Due Date:</span> {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}</p>
                    </div>
                  </div>
                  {formData.logoUrl && (
                    <div className="w-20 h-20 border rounded-lg overflow-hidden bg-white">
                      <img src={formData.logoUrl} alt="Company logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
                    <div className="text-gray-700">
                      <p className="font-medium text-lg">{formData.client || 'Client not selected'}</p>
                      <p className="text-sm text-gray-500 mt-1">Client details will be populated from your records</p>
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
                      {formData.workItems.map((item, index) => (
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
                          ${formData.workItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                        </td>
                      </tr>
                      {formData.taxRate > 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                            Tax ({formData.taxRate}%):
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                            ${(formData.workItems.reduce((sum, item) => sum + item.amount, 0) * (formData.taxRate / 100)).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-gray-300">
                        <td colSpan={3} className="px-6 py-4 text-right text-lg font-bold text-gray-900">Total:</td>
                        <td className="px-6 py-4 text-right text-lg font-bold text-primary">
                          ${(
                            formData.workItems.reduce((sum, item) => sum + item.amount, 0) *
                            (1 + formData.taxRate / 100)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Notes */}
                {formData.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes & Payment Terms:</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {formData.notes}
                    </div>
                  </div>
                )}

                {/* Footer Message */}
                <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
                  <p>Thank you for your business! Payment is due within {formData.dueDate ? Math.ceil((new Date(formData.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : '30'} days.</p>
                </div>
              </div>
            </div>

            {/* Preview Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                Close Preview
              </button>
              <button
                onClick={handlePreviewDownloadPDF}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
}