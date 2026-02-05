'use client';

/* ==========================================================================
   Messages Page
   Email-style messaging for freelancers
   ========================================================================== */

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { MessageComposer, MessageList, ConversationView, Message } from '@/components/messages';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// ==========================================================================
// Sample Messages Data
// ==========================================================================

const sampleMessages: Message[] = [
  {
    id: '1',
    to: 'client@techcorp.com',
    subject: 'Project Update: Website Redesign',
    body: 'Hi John,\n\nI wanted to provide you with an update on the website redesign project.\n\nCurrent Status: We\'ve completed the homepage design and are now working on the internal pages.\nNext Steps: We\'ll have the first draft ready for your review by Friday.\n\nPlease let me know if you have any questions.\n\nBest regards,\nSarah Johnson',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'delivered',
    type: 'sent'
  },
  {
    id: '2',
    to: 'client@startupxyz.com',
    subject: 'Meeting Request: Q1 Planning',
    body: 'Hi Mike,\n\nI\'d like to schedule a meeting to discuss the Q1 planning for your mobile app project.\n\nProposed times:\n- Tuesday 2:00 PM EST\n- Wednesday 10:00 AM EST\n- Thursday 3:00 PM EST\n\nPlease let me know which time works best for you, or suggest an alternative.\n\nBest regards,\nSarah Johnson',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'read',
    type: 'sent'
  },
  {
    id: '3',
    to: 'sarah@freelanceflow.com',
    subject: 'Re: Invoice #001 - Logo Design',
    body: 'Hi Sarah,\n\nThank you for sending the invoice. I\'ve reviewed it and everything looks correct. I\'ll process the payment today and it should be in your account within 2-3 business days.\n\nGreat work on the logo design - our team loves it!\n\nBest regards,\nDavid Chen\nCEO, Local Business Co.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'read',
    type: 'received'
  },
  {
    id: '4',
    to: 'client@growthhub.com',
    subject: 'Project Completed: Social Media Strategy',
    body: 'Hi Emma,\n\nI\'m pleased to announce that the social media strategy project has been completed!\n\nDeliverables:\n- Comprehensive social media strategy document\n- Content calendar for Q1\n- Brand guidelines for social platforms\n- Performance tracking templates\n\nYou can review the final deliverables here: [link to deliverables]\n\nPlease let me know if you need any revisions or have feedback.\n\nBest regards,\nSarah Johnson',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'sent',
    type: 'sent'
  }
];

// ==========================================================================
// Messages Page Component
// ==========================================================================

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  const [isMobileView, setIsMobileView] = useState(false);

  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSendMessage = (messageData: { to: string; subject: string; body: string }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      to: messageData.to,
      subject: messageData.subject,
      body: messageData.body,
      timestamp: new Date(),
      status: 'sent',
      type: 'sent'
    };

    setMessages(prev => [newMessage, ...prev]);
    setShowComposer(false);
    // In a real app, this would send the email via backend
    alert('Message sent successfully! (Frontend demo - no actual email sent)');
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  const handleReply = (originalMessage: Message) => {
    const replySubject = originalMessage.subject.startsWith('Re:') ? originalMessage.subject : `Re: ${originalMessage.subject}`;
    setShowComposer(true);
    // The composer will be initialized with reply data
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.type === filter;
  });

  const selectedMessageId = selectedMessage ? selectedMessage.id : undefined;

  if (showComposer) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-6">
          <MessageComposer
            onSend={handleSendMessage}
            onCancel={() => setShowComposer(false)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-500 mt-1">Send emails to your clients</p>
          </div>
          <Button onClick={() => setShowComposer(true)}>
            Compose Message
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              {/* Filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex gap-2 overflow-x-auto">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                      filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    onClick={() => setFilter('sent')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                      filter === 'sent' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Sent ({messages.filter(m => m.type === 'sent').length})
                  </button>
                  <button
                    onClick={() => setFilter('received')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                      filter === 'received' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Received ({messages.filter(m => m.type === 'received').length})
                  </button>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4">
                <MessageList
                  messages={filteredMessages}
                  onSelectMessage={handleSelectMessage}
                  selectedMessageId={selectedMessageId}
                />
              </div>
            </Card>
          </div>

          {/* Message View */}
          <div className="lg:col-span-2">
            <ConversationView
              message={selectedMessage}
              onReply={handleReply}
              onBack={handleBackToList}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {!selectedMessage ? (
            /* Mobile Message List */
            <div style={{ height: 'calc(100vh - 200px)' }}>
              <Card className="h-full flex flex-col">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex gap-2 overflow-x-auto">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                        filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All ({messages.length})
                    </button>
                    <button
                      onClick={() => setFilter('sent')}
                      className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                        filter === 'sent' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Sent ({messages.filter(m => m.type === 'sent').length})
                    </button>
                    <button
                      onClick={() => setFilter('received')}
                      className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                        filter === 'received' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Received ({messages.filter(m => m.type === 'received').length})
                    </button>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <MessageList
                    messages={filteredMessages}
                    onSelectMessage={handleSelectMessage}
                    selectedMessageId={selectedMessageId}
                  />
                </div>
              </Card>
            </div>
          ) : (
            /* Mobile Message View - Full Screen */
            <div className="fixed inset-0 z-50 bg-white">
              <ConversationView
                message={selectedMessage}
                onReply={handleReply}
                onBack={handleBackToList}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
