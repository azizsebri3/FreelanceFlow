'use client';

/* ==========================================================================
   Message Composer Component
   Compose and send emails to clients
   ========================================================================== */

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface MessageComposerProps {
  onSend: (message: { to: string; subject: string; body: string }) => void;
  onCancel: () => void;
  initialData?: { to?: string; subject?: string; body?: string };
}

const messageTemplates = [
  {
    name: 'Project Update',
    subject: 'Project Update: {Project Name}',
    body: 'Hi {Client Name},\n\nI wanted to provide you with an update on {Project Name}.\n\nCurrent Status: {Status}\nNext Steps: {Next Steps}\n\nPlease let me know if you have any questions.\n\nBest regards,\n{Freelancer Name}'
  },
  {
    name: 'Invoice Sent',
    subject: 'Invoice #{Invoice Number} - {Project Name}',
    body: 'Hi {Client Name},\n\nI\'ve sent you the invoice for {Project Name}.\n\nInvoice Details:\n- Amount: {Amount}\n- Due Date: {Due Date}\n- Payment Terms: {Terms}\n\nYou can view and pay the invoice here: {Invoice Link}\n\nThank you for your business!\n\nBest regards,\n{Freelancer Name}'
  },
  {
    name: 'Meeting Request',
    subject: 'Meeting Request: {Topic}',
    body: 'Hi {Client Name},\n\nI\'d like to schedule a meeting to discuss {Topic}.\n\nProposed times:\n- {Time 1}\n- {Time 2}\n- {Time 3}\n\nPlease let me know which time works best for you, or suggest an alternative.\n\nBest regards,\n{Freelancer Name}'
  },
  {
    name: 'Project Completed',
    subject: 'Project Completed: {Project Name}',
    body: 'Hi {Client Name},\n\nI\'m pleased to announce that {Project Name} has been completed!\n\nDeliverables:\n- {Deliverable 1}\n- {Deliverable 2}\n- {Deliverable 3}\n\nYou can review the final work here: {Review Link}\n\nPlease let me know if you need any revisions or have feedback.\n\nBest regards,\n{Freelancer Name}'
  }
];

export default function MessageComposer({ onSend, onCancel, initialData }: MessageComposerProps) {
  const [to, setTo] = useState(initialData?.to || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSend = () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      alert('Please fill in all fields');
      return;
    }
    onSend({ to: to.trim(), subject: subject.trim(), body: body.trim() });
  };

  const applyTemplate = (template: typeof messageTemplates[0]) => {
    setSubject(template.subject);
    setBody(template.body);
    setShowTemplates(false);
  };

  return (
    <Card className="max-w-2xl mx-auto w-full mx-4 sm:mx-auto">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Compose Message</h2>

        <div className="space-y-4">
          {/* To Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <Input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="client@example.com"
              className="w-full"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject line"
              className="w-full"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-vertical text-sm sm:text-base"
            />
          </div>

          {/* Templates */}
          <div>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              {showTemplates ? 'Hide Templates' : 'Use Template'}
            </button>

            {showTemplates && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Choose a template to get started:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {messageTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => applyTemplate(template)}
                      className="text-left p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSend} className="w-full sm:w-auto">
            Send Message
          </Button>
        </div>
      </div>
    </Card>
  );
}