'use client';

/* ==========================================================================
   Work Items Manager Component
   Component for managing work items in invoices
   ========================================================================== */

import React, { useState } from 'react';

export interface WorkItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface WorkItemsManagerProps {
  workItems: WorkItem[];
  onChange: (workItems: WorkItem[]) => void;
}

export default function WorkItemsManager({ workItems, onChange }: WorkItemsManagerProps) {
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    rate: 0,
  });

  const addWorkItem = () => {
    if (!newItem.description.trim() || newItem.rate <= 0) return;

    const item: WorkItem = {
      id: Date.now().toString(),
      description: newItem.description.trim(),
      quantity: newItem.quantity,
      rate: newItem.rate,
      amount: newItem.quantity * newItem.rate,
    };

    onChange([...workItems, item]);
    setNewItem({ description: '', quantity: 1, rate: 0 });
  };

  const removeWorkItem = (id: string) => {
    onChange(workItems.filter(item => item.id !== id));
  };

  const updateWorkItem = (id: string, field: keyof WorkItem, value: string | number) => {
    const updatedItems = workItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    onChange(updatedItems);
  };

  const totalAmount = workItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Existing Work Items */}
      {workItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-900">Work Items</h4>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {workItems.length} item{workItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Qty</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Rate</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workItems.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateWorkItem(item.id, 'description', e.target.value)}
                          className="w-full border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 text-sm transition-all"
                          placeholder="Enter description..."
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="1"
                          step="0.5"
                          value={item.quantity}
                          onChange={(e) => updateWorkItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-20 text-right border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 text-sm transition-all"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <span className="text-gray-500 mr-1">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateWorkItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-24 text-right border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 text-sm transition-all"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-900">${item.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => removeWorkItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 group"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-primary/5 to-primary/10 border-t border-primary/20">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">Subtotal:</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-bold text-primary">${totalAmount.toFixed(2)}</span>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add New Work Item */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h4 className="text-lg font-semibold text-gray-900">Add New Work Item</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              placeholder="e.g., Website development, Logo design..."
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              step="0.5"
              placeholder="1"
              value={newItem.quantity || ''}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 1 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={newItem.rate || ''}
              onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={addWorkItem}
              disabled={!newItem.description.trim() || newItem.rate <= 0}
              className="w-full px-6 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        {/* Preview Amount */}
        {newItem.description && newItem.rate > 0 && (
          <div className="mt-4 p-3 bg-white/60 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Preview:</span>
              <span className="font-semibold text-primary">
                ${((newItem.quantity || 1) * newItem.rate).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {workItems.length === 0 && (
        <div className="text-center py-12 px-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No work items yet</h3>
          <p className="text-gray-500 text-sm">Add your first work item using the form above</p>
        </div>
      )}
    </div>
  );
}