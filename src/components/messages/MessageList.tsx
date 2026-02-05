'use client';

/* ==========================================================================
   Message List Component
   Display sent and received messages
   ========================================================================== */

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export interface Message {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  type: 'sent' | 'received';
}

interface MessageListProps {
  messages: Message[];
  onSelectMessage: (message: Message) => void;
  selectedMessageId?: string;
}

export default function MessageList({ messages, onSelectMessage, selectedMessageId }: MessageListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
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
    <div className="space-y-2">
      {messages.length === 0 ? (
        <Card className="p-6 sm:p-8 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">No messages yet</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Start a conversation with a client</p>
        </Card>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMessageId === message.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
            }`}
            onClick={() => onSelectMessage(message)}
          >
            <Card>
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <span className={`text-sm font-medium ${message.type === 'sent' ? 'text-gray-900' : 'text-primary'}`}>
                        {message.type === 'sent' ? `To: ${message.to}` : `From: ${message.to}`}
                      </span>
                      <Badge variant={message.status === 'sent' ? 'info' : message.status === 'delivered' ? 'success' : message.status === 'read' ? 'primary' : 'danger'} size="sm">
                        {getStatusIcon(message.status)} {message.status}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {message.subject}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {message.body.length > 100 ? `${message.body.substring(0, 100)}...` : message.body}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2 sm:ml-3">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}