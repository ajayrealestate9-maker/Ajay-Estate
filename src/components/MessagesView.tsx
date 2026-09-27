import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Paperclip,
  FileText,
  Building2,
  ExternalLink,
  ShieldCheck,
  Check,
  CheckCheck,
  Phone,
  MessageSquare,
  Search,
  Sparkles,
  Download,
  Eye,
  X,
  PlusCircle,
  Home,
  User,
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/formatters';
import { ChatConversation, ChatMessage, DocumentAttachment, PropertyAttachment, PropertyListing } from '../types';

interface MessagesViewProps {
  onSelectProperty?: (property: PropertyListing) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ onSelectProperty }) => {
  const {
    currentUser,
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    markConversationAsRead,
    properties,
    language,
    setAuthModalOpen,
  } = useApp();

  const [inputText, setInputText] = useState<string>('');
  const [conversationSearch, setConversationSearch] = useState<string>('');
  const [isAttachDocModalOpen, setIsAttachDocModalOpen] = useState<boolean>(false);
  const [isAttachPropertyModalOpen, setIsAttachPropertyModalOpen] = useState<boolean>(false);
  const [previewDocument, setPreviewDocument] = useState<DocumentAttachment | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  // Recipient details
  const myId = currentUser?.id || 'guest-user';
  const otherParticipant = activeConv?.participants.find((p) => p.id !== myId) || activeConv?.participants[1] || {
    id: 'user-other',
    name: 'Real Estate Member',
    role: 'seller' as const,
    mobile: '9876543210',
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversationId]);

  // Mark as read when conversation is active
  useEffect(() => {
    if (activeConv && activeConv.unreadCount > 0) {
      markConversationAsRead(activeConv.id);
    }
  }, [activeConv?.id]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (!activeConv) return;

    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleQuickTemplate = (text: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, text);
  };

  const handleAttachDocument = (doc: DocumentAttachment) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, `Shared legal revenue document: ${doc.name}`, undefined, doc);
    setIsAttachDocModalOpen(false);
  };

  const handleAttachProperty = (prop: PropertyListing) => {
    if (!activeConv) return;
    const propAttachment: PropertyAttachment = {
      id: prop.id,
      subType: prop.subType,
      propertyType: prop.propertyType,
      expectedPrice: prop.expectedPrice,
      city: prop.city,
      localitySector: prop.localitySector,
      photoUrl: prop.photos[0],
      areaText: `${prop.areaValue} ${prop.areaUnit}`,
    };
    sendMessage(
      activeConv.id,
      `Check out this ${prop.subType} in ${prop.city}`,
      propAttachment
    );
    setIsAttachPropertyModalOpen(false);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!conversationSearch.trim()) return true;
    const q = conversationSearch.toLowerCase();
    const other = c.participants.find((p) => p.id !== myId);
    return (
      other?.name.toLowerCase().includes(q) ||
      c.propertyTitle?.toLowerCase().includes(q) ||
      c.lastMessageText.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden h-[750px] flex flex-col md:flex-row">
        {/* LEFT COLUMN: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-stone-200 flex flex-col bg-stone-50/60">
          {/* Header */}
          <div className="p-4 border-b border-stone-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-stone-900 font-display">
                {language === 'pa' ? 'ਗੱਲਬਾਤ ਅਤੇ ਸੁਨੇਹੇ' : 'Property Messages'}
              </h2>
              <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {conversations.length} Active Chats
              </span>
            </div>
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={conversationSearch}
                onChange={(e) => setConversationSearch(e.target.value)}
                placeholder="Search chats or properties..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-100 rounded-lg border-0 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {filteredConversations.map((conv) => {
              const other = conv.participants.find((p) => p.id !== myId) || conv.participants[1];
              const isSelected = activeConv?.id === conv.id;
              const formattedTime = new Date(conv.lastMessageTimestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/80 border-l-4 border-amber-600'
                      : 'hover:bg-stone-100/70 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {other?.name ? other.name[0] : 'U'}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{other?.name}</h4>
                        <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                          {other?.role === 'mediator' ? 'Mediator / Dealer' : other?.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 shrink-0 font-mono">{formattedTime}</span>
                  </div>

                  {conv.propertyTitle && (
                    <div className="text-[11px] text-amber-900 font-medium truncate mb-1 bg-amber-50/50 px-1.5 py-0.5 rounded">
                      🏷️ {conv.propertyTitle}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="truncate pr-2 text-[11px]">{conv.lastMessageText}</span>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat Panel */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Top Header */}
            <div className="px-6 py-3.5 border-b border-stone-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
                  {otherParticipant.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900">{otherParticipant.name}</h3>
                    <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full uppercase">
                      {otherParticipant.role}
                    </span>
                    {otherParticipant.role === 'mediator' && (
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        RERA Certified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                    <span>Mobile: +91 {otherParticipant.mobile}</span>
                    {activeConv.propertyTitle && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span className="text-amber-800 font-medium truncate max-w-xs">
                          {activeConv.propertyTitle}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Communication Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.open(`tel:+91${otherParticipant.mobile}`, '_self')}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="Direct Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(`Sat Sri Akal ${otherParticipant.name}, I am following up on our ZameenKothi conversation.`);
                    window.open(`https://wa.me/91${otherParticipant.mobile}?text=${text}`, '_blank');
                  }}
                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Templates Ribbon */}
            <div className="px-6 py-2 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-stone-400 text-[11px] font-semibold shrink-0">Quick Ask:</span>
              {[
                'Is this property available for a site visit this Saturday?',
                'Please share the Jamabandi Fard / Registry copy.',
                'What is the token / bayana amount expected?',
                'Is the price negotiable for an immediate deal?',
              ].map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickTemplate(template)}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50/60 rounded-full text-stone-700 text-[11px] whitespace-nowrap transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>

            {/* Messages Thread Container */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-50/40">
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === myId;
                const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {/* Sender Label & Role Badge */}
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-1 px-1">
                      <span className="font-semibold text-stone-600">{msg.senderName}</span>
                      <span>({msg.senderRole})</span>
                      <span>· {formattedTime}</span>
                    </div>

                    <div
                      className={`max-w-md sm:max-w-lg rounded-2xl p-3.5 shadow-xs space-y-2.5 text-xs ${
                        isMe
                          ? 'bg-amber-600 text-white rounded-tr-none'
                          : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none'
                      }`}
                    >
                      {/* Attached Property Card */}
                      {msg.propertyAttachment && (
                        <div
                          onClick={() => {
                            const p = properties.find((item) => item.id === msg.propertyAttachment?.id);
                            if (p && onSelectProperty) onSelectProperty(p);
                          }}
                          className={`rounded-xl p-2.5 border cursor-pointer transition-all ${
                            isMe
                              ? 'bg-amber-700/80 border-amber-500/50 text-white'
                              : 'bg-stone-50 border-stone-200 text-stone-900 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex gap-2.5 items-center">
                            <img
                              src={msg.propertyAttachment.photoUrl}
                              alt="Property"
                              className="w-14 h-14 object-cover rounded-lg shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${isMe ? 'text-amber-200' : 'text-amber-700'}`}>
                                {msg.propertyAttachment.propertyType}
                              </span>
                              <h5 className="font-bold text-xs truncate">
                                {msg.propertyAttachment.subType}
                              </h5>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-mono font-bold">
                                  {formatIndianCurrency(msg.propertyAttachment.expectedPrice)}
                                </span>
                                <span className="text-[10px] underline inline-flex items-center gap-0.5">
                                  View Details <ExternalLink className="w-2.5 h-2.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Attached Document Card */}
                      {msg.documentAttachment && (
                        <div
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                            isMe
                              ? 'bg-amber-700/80 border-amber-500/50 text-white'
                              : 'bg-stone-50 border-stone-200 text-stone-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-xs flex items-center gap-1">
                                <span>{msg.documentAttachment.name}</span>
                                {msg.documentAttachment.verified && (
                                  <span title="Government Revenue Verified">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] opacity-75">
                                {msg.documentAttachment.fileSize} · Revenue Department Document
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPreviewDocument(msg.documentAttachment!)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 ${
                              isMe
                                ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        </div>
                      )}

                      {/* Main Message Text */}
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Delivery / Read Status */}
                    <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5 px-1">
                      {isMe && (
                        <span className="inline-flex items-center">
                          {msg.isRead ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-stone-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Composer */}
            <form onSubmit={handleSend} className="p-4 border-t border-stone-200 bg-white">
              <div className="flex items-center gap-2">
                {/* Share Document button */}
                <button
                  type="button"
                  onClick={() => setIsAttachDocModalOpen(true)}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                  title="Share Legal Title / Fard / Allotment Document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Share Property card button */}
                <button
                  type="button"
                  onClick={() => setIsAttachPropertyModalOpen(true)}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                  title="Share Property Listing in Chat"
                >
                  <Home className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message, offer, or questions..."
                  className="flex-1 px-4 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-400 text-center">
            <MessageSquare className="w-12 h-12 mb-3 text-stone-300" />
            <h3 className="text-base font-bold text-stone-700">No Conversation Selected</h3>
            <p className="text-xs text-stone-500 max-w-xs mt-1">
              Select an existing chat or click "Contact Seller / Mediator" on any property to start a direct message thread.
            </p>
          </div>
        )}
      </div>

      {/* DOCUMENT ATTACH SELECTOR MODAL */}
      {isAttachDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-stone-900">Share Verified Property Document</h3>
              <button onClick={() => setIsAttachDocModalOpen(false)}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                {
                  id: 'doc-gmada-noc',
                  name: 'GMADA_Sector70_ClearTitle_NOC.pdf',
                  fileSize: '2.4 MB',
                  documentType: 'registry' as const,
                  downloadUrl: '#',
                  verified: true,
                },
                {
                  id: 'doc-jamabandi-fard',
                  name: 'Punjab_Revenue_Jamabandi_Fard.pdf',
                  fileSize: '3.1 MB',
                  documentType: 'fard' as const,
                  downloadUrl: '#',
                  verified: true,
                },
                {
                  id: 'doc-sanctioned-plan',
                  name: 'Kothi_Sanctioned_FloorPlan_1Kanal.pdf',
                  fileSize: '1.9 MB',
                  documentType: 'layout' as const,
                  downloadUrl: '#',
                  verified: false,
                },
                {
                  id: 'doc-rera-certificate',
                  name: 'Punjab_RERA_Agent_Registration_License.pdf',
                  fileSize: '1.2 MB',
                  documentType: 'noc' as const,
                  downloadUrl: '#',
                  verified: true,
                },
              ].map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleAttachDocument(doc)}
                  className="p-3 border border-stone-200 rounded-lg hover:border-amber-500 hover:bg-amber-50/50 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-bold text-stone-900">{doc.name}</div>
                      <span className="text-[10px] text-stone-500">{doc.fileSize} · {doc.documentType.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700">Attach</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROPERTY ATTACH SELECTOR MODAL */}
      {isAttachPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 p-6 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-stone-900">Share Property Card</h3>
              <button onClick={() => setIsAttachPropertyModalOpen(false)}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              {properties.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleAttachProperty(p)}
                  className="p-2.5 border border-stone-200 rounded-lg hover:border-amber-500 hover:bg-amber-50/50 cursor-pointer flex items-center gap-3"
                >
                  <img src={p.photos[0]} alt={p.subType} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1 truncate">
                    <div className="font-bold text-stone-900 truncate">{p.subType}</div>
                    <div className="text-[11px] text-stone-500">{p.city} · {p.areaValue} {p.areaUnit}</div>
                    <span className="font-mono font-bold text-amber-800">{formatIndianCurrency(p.expectedPrice)}</span>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 shrink-0">Send</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{previewDocument.name}</h3>
                  <span className="text-[11px] text-stone-500">Official Revenue Record Preview</span>
                </div>
              </div>
              <button onClick={() => setPreviewDocument(null)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="p-8 text-center space-y-4 bg-stone-100">
              <div className="bg-white p-6 rounded-xl border border-stone-300 shadow-sm max-w-md mx-auto text-left font-serif text-xs space-y-3">
                <div className="text-center border-b pb-2">
                  <h4 className="font-bold uppercase tracking-wider text-sm">Government of Punjab</h4>
                  <span className="text-[10px] text-stone-500">Department of Revenue &amp; Rehabilitation / GMADA</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div><strong>Document Ref:</strong> PB-GMADA-2026/8941</div>
                  <div><strong>Property:</strong> 1 Kanal Residential Estate, Sector 70, SAS Nagar</div>
                  <div><strong>Verification Status:</strong> Clear Title · Free of Encumbrances · Registry Done</div>
                  <div><strong>Jamabandi Khewat:</strong> 142/219, Khatauni: 388</div>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-[10px] flex items-center gap-1 font-sans">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Authenticated digital copy with official Tehsil e-stamp seal.</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-white border-t border-stone-200 flex justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPreviewDocument(null)}
                className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Downloading ${previewDocument.name} for offline legal review.`);
                  setPreviewDocument(null);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
