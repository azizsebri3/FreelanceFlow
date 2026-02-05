'use client';

/* ==========================================================================
   Conversation View Component
   Display full message details
   ========================================================================== */

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Message } from './MessageList';

interface ConversationViewProps {
  message: Message | null;
  onReply: (message: Message) => void;
  onBack: () => void;
}

export default function ConversationView({ message, onReply, onBack }: ConversationViewProps) {
  if (!message) {
    return (
      <Card className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p>Select a message to view details</p>
        </div>
      </Card>
    );
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent': return '📤';
      case 'delivered': return '✅';
      case 'read': return '👁️';
      case 'failed': return '❌';
      default: return '📧';
    }
  };

  return (
    <Card className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Button variant="secondary" size="sm" onClick={onBack} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Messages</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <Button size="sm" onClick={() => onReply(message)} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="hidden sm:inline">Reply</span>
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
              {message.subject}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600">
              <span>{message.type === 'sent' ? 'To:' : 'From:'} {message.to}</span>
              <span className="hidden sm:inline">•</span>
              <span>{formatDateTime(message.timestamp)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={message.status === 'sent' ? 'info' : message.status === 'delivered' ? 'success' : message.status === 'read' ? 'primary' : 'danger'}>
              {getStatusIcon(message.status)} {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-900 leading-relaxed text-sm sm:text-base">
            {message.body}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => onReply(message)} className="flex-1 sm:flex-initial">
            Reply to this message
          </Button>
          <Button variant="secondary" className="flex-1 sm:flex-initial">
            Forward
          </Button>
        </div>
      </div>
    </Card>
  );
}