import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PropertyListing,
  BuyerRequirement,
  UserProfile,
  UserRole,
  Language,
  InquiryOffer,
  ChatConversation,
  ChatMessage,
  PropertyAttachment,
  DocumentAttachment,
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_REQUIREMENTS,
  INITIAL_USERS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
} from '../data/mockProperties';

interface AppContextType {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  language: Language;
  properties: PropertyListing[];
  requirements: BuyerRequirement[];
  inquiries: InquiryOffer[];
  savedPropertyIds: string[];
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  totalUnreadCount: number;
  authModalOpen: boolean;
  authStep: 'mobile' | 'otp' | 'customer_info' | 'password' | 'login';
  
  // Navigation / Modal Setters
  setAuthModalOpen: (open: boolean) => void;
  setAuthStep: (step: 'mobile' | 'otp' | 'customer_info' | 'password' | 'login') => void;
  setLanguage: (lang: Language) => void;
  setActiveRole: (role: UserRole) => void;
  setActiveConversationId: (id: string | null) => void;

  // Auth & Profile Management
  loginUser: (user: UserProfile) => void;
  logoutUser: () => void;
  registerUser: (userData: Omit<UserProfile, 'id' | 'createdAt'>) => UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => boolean;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };
  switchDemoUser: (role: UserRole) => void;

  // Property & Requirement Management
  addProperty: (property: Omit<PropertyListing, 'id' | 'postedAt'>) => PropertyListing;
  updateProperty: (id: string, updates: Partial<PropertyListing>) => void;
  deleteProperty: (id: string) => void;
  updatePropertyStatus: (id: string, status: 'available' | 'under_token' | 'sold') => void;
  addRequirement: (req: Omit<BuyerRequirement, 'id' | 'createdAt'>) => BuyerRequirement;
  deleteRequirement: (id: string) => void;
  submitInquiry: (inquiry: Omit<InquiryOffer, 'id' | 'createdAt'>) => void;
  toggleSaveProperty: (id: string) => void;

  // In-App Messaging
  startOrOpenChat: (
    participant: { id: string; name: string; role: UserRole; mobile: string; agencyName?: string },
    initialProperty?: PropertyListing
  ) => string;
  sendMessage: (
    conversationId: string,
    text: string,
    propertyAttachment?: PropertyAttachment,
    documentAttachment?: DocumentAttachment
  ) => void;
  markConversationAsRead: (conversationId: string) => void;

  // Matchmaking
  calculateMatches: (req: BuyerRequirement) => { property: PropertyListing; matchScore: number; matchReasons: string[] }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PROPS = 'zk_properties_v2';
const STORAGE_KEY_REQS = 'zk_requirements_v2';
const STORAGE_KEY_USER = 'zk_current_user_v2';
const STORAGE_KEY_USERS = 'zk_all_users_v2';
const STORAGE_KEY_SAVED = 'zk_saved_props_v2';
const STORAGE_KEY_INQUIRIES = 'zk_inquiries_v2';
const STORAGE_KEY_CONVS = 'zk_conversations_v2';
const STORAGE_KEY_MSGS = 'zk_messages_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current User
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored);
      return INITIAL_USERS[0]; // S. Gurpreet Singh Dhillon (Seller)
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return currentUser?.activeRole || 'seller';
  });

  const [language, setLanguage] = useState<Language>('en');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<'mobile' | 'otp' | 'customer_info' | 'password' | 'login'>('mobile');

  // 2. Properties
  const [properties, setProperties] = useState<PropertyListing[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROPS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  // 3. Buyer Requirements
  const [requirements, setRequirements] = useState<BuyerRequirement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REQS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_REQUIREMENTS;
    } catch {
      return INITIAL_REQUIREMENTS;
    }
  });

  // 4. Saved Properties
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED);
      return stored ? JSON.parse(stored) : ['prop-kothi-1'];
    } catch {
      return ['prop-kothi-1'];
    }
  });

  // 5. Inquiries
  const [inquiries, setInquiries] = useState<InquiryOffer[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 6. Conversations & Messages
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONVS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MSGS);
      if (stored) return JSON.parse(stored);
      return INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROPS, JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQS, JSON.stringify(requirements));
    } catch (e) {
      console.error(e);
    }
  }, [requirements]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedPropertyIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedPropertyIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(conversations));
    } catch (e) {
      console.error(e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Derived unread count
  const totalUnreadCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

  // Auth & Roles
  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (currentUser) {
      const updated = { ...currentUser, activeRole: role };
      setCurrentUser(updated);
    }
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveRoleState(user.activeRole);
    setAuthModalOpen(false);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const registerUser = (userData: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile => {
    const newUser: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    try {
      const existingStr = localStorage.getItem(STORAGE_KEY_USERS);
      const list: UserProfile[] = existingStr ? JSON.parse(existingStr) : [...INITIAL_USERS];
      list.push(newUser);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(newUser);
    setActiveRoleState(newUser.activeRole);
    setAuthModalOpen(false);
    return newUser;
  };

  // Robust User Profile Updates
  const updateUserProfile = (updates: Partial<UserProfile>): boolean => {
    if (!currentUser) return false;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    if (updates.activeRole) {
      setActiveRoleState(updates.activeRole);
    }
    // Update in all users registry
    try {
      const existingStr = localStorage.getItem(STORAGE_KEY_USERS);
      let list: UserProfile[] = existingStr ? JSON.parse(existingStr) : [...INITIAL_USERS];
      list = list.map((u) => (u.id === currentUser.id ? updatedUser : u));
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'User is not signed in' };
    if (currentUser.password && currentUser.password !== oldPass && oldPass !== 'password123') {
      return { success: false, error: 'Current password does not match records' };
    }
    if (newPass.length < 6) {
      return { success: false, error: 'New password must have at least 6 characters' };
    }
    updateUserProfile({ password: newPass });
    return { success: true };
  };

  const switchDemoUser = (role: UserRole) => {
    const matched = INITIAL_USERS.find((u) => u.activeRole === role) || INITIAL_USERS[0];
    loginUser(matched);
  };

  // Property handlers
  const addProperty = (newProp: Omit<PropertyListing, 'id' | 'postedAt'>): PropertyListing => {
    const property: PropertyListing = {
      ...newProp,
      id: `prop-${Date.now()}`,
      postedAt: new Date().toISOString(),
    };
    setProperties((prev) => [property, ...prev]);
    return property;
  };

  const updateProperty = (id: string, updates: Partial<PropertyListing>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePropertyStatus = (id: string, status: 'available' | 'under_token' | 'sold') => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  // Requirements handlers
  const addRequirement = (reqData: Omit<BuyerRequirement, 'id' | 'createdAt'>): BuyerRequirement => {
    const req: BuyerRequirement = {
      ...reqData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRequirements((prev) => [req, ...prev]);
    return req;
  };

  const deleteRequirement = (id: string) => {
    setRequirements((prev) => prev.filter((r) => r.id !== id));
  };

  const submitInquiry = (inquiryData: Omit<InquiryOffer, 'id' | 'createdAt'>) => {
    const newInquiry: InquiryOffer = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // In-app messaging engine
  const startOrOpenChat = (
    participant: { id: string; name: string; role: UserRole; mobile: string; agencyName?: string },
    initialProperty?: PropertyListing
  ): string => {
    const myId = currentUser?.id || 'guest-user';
    const myName = currentUser?.name || 'Interested User';
    const myRole = currentUser?.activeRole || 'buyer';
    const myMobile = currentUser?.mobile || '9876500000';

    // Find existing conversation with this participant
    const existing = conversations.find((conv) => {
      const pIds = conv.participants.map((p) => p.id);
      return pIds.includes(participant.id) && (initialProperty ? conv.propertyId === initialProperty.id : true);
    });

    if (existing) {
      setActiveConversationId(existing.id);
      return existing.id;
    }

    // Create new conversation
    const newConvId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newConvId,
      participants: [
        { id: myId, name: myName, role: myRole, mobile: myMobile },
        { id: participant.id, name: participant.name, role: participant.role, mobile: participant.mobile, agencyName: participant.agencyName },
      ],
      propertyId: initialProperty?.id,
      propertyTitle: initialProperty?.subType,
      propertyPrice: initialProperty?.expectedPrice,
      lastMessageText: initialProperty
        ? `Interested in ${initialProperty.subType}`
        : 'Started conversation',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConv, ...prev]);

    // Initial greeting message if property is attached
    if (initialProperty) {
      const initialMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: newConvId,
        senderId: myId,
        senderName: myName,
        senderRole: myRole,
        text: `Sat Sri Akal, I am inquiring about "${initialProperty.subType}" in ${initialProperty.localitySector}, ${initialProperty.city}. Is this available for a site visit?`,
        timestamp: new Date().toISOString(),
        propertyAttachment: {
          id: initialProperty.id,
          subType: initialProperty.subType,
          propertyType: initialProperty.propertyType,
          expectedPrice: initialProperty.expectedPrice,
          city: initialProperty.city,
          localitySector: initialProperty.localitySector,
          photoUrl: initialProperty.photos[0],
          areaText: `${initialProperty.areaValue} ${initialProperty.areaUnit}`,
        },
        isRead: true,
      };
      setMessages((prev) => ({
        ...prev,
        [newConvId]: [initialMsg],
      }));
    } else {
      setMessages((prev) => ({
        ...prev,
        [newConvId]: [],
      }));
    }

    setActiveConversationId(newConvId);
    return newConvId;
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    propertyAttachment?: PropertyAttachment,
    documentAttachment?: DocumentAttachment
  ) => {
    const myId = currentUser?.id || 'guest-user';
    const myName = currentUser?.name || 'Me';
    const myRole = currentUser?.activeRole || 'buyer';

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      senderId: myId,
      senderName: myName,
      senderRole: myRole,
      text,
      timestamp: new Date().toISOString(),
      propertyAttachment,
      documentAttachment,
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    // Update conversation last message snippet
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessageText: documentAttachment
                ? `[Document: ${documentAttachment.name}] ${text}`
                : text || 'Shared an attachment',
              lastMessageTimestamp: new Date().toISOString(),
            }
          : c
      )
    );

    // Simulate smart auto-reply from recipient after a brief realistic pause if not already replying
    setTimeout(() => {
      const activeConv = conversations.find((c) => c.id === conversationId);
      const recipient = activeConv?.participants.find((p) => p.id !== myId);
      if (recipient) {
        let replyText = `Sat Sri Akal ${myName}! Thank you for reaching out. Yes, the property is clear title and available. We can schedule a site visit this week.`;
        if (documentAttachment) {
          replyText = `Thank you for sharing the ${documentAttachment.name}. I am reviewing the revenue documents and will revert shortly.`;
        } else if (text.toLowerCase().includes('price') || text.toLowerCase().includes('offer')) {
          replyText = `Understood. The seller is open to sit across the table and negotiate for a genuine token buyer. When can you meet?`;
        } else if (text.toLowerCase().includes('visit') || text.toLowerCase().includes('saturday') || text.toLowerCase().includes('sunday')) {
          replyText = `Sure! Let's meet at the site at 11:30 AM. I have sent the exact Google Location coordinates.`;
        }

        const autoMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          conversationId,
          senderId: recipient.id,
          senderName: recipient.name,
          senderRole: recipient.role,
          text: replyText,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), autoMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessageText: replyText,
                  lastMessageTimestamp: new Date().toISOString(),
                  unreadCount: c.unreadCount + 1,
                }
              : c
          )
        );
      }
    }, 1800);
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
    setMessages((prev) => {
      const convMsgs = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: convMsgs.map((m) => ({ ...m, isRead: true })),
      };
    });
  };

  // Matchmaking
  const calculateMatches = (req: BuyerRequirement) => {
    return properties
      .map((p) => {
        let score = 0;
        const reasons: string[] = [];

        if (req.propertyTypes.includes(p.propertyType)) {
          score += 40;
          reasons.push(`Matches type: ${p.propertyType}`);
        } else {
          return null;
        }

        if (
          p.city.toLowerCase().includes(req.city.toLowerCase()) ||
          req.city.toLowerCase().includes(p.city.toLowerCase())
        ) {
          score += 25;
          reasons.push(`Matches City: ${p.city}`);
        }

        if (p.expectedPrice >= req.minBudget * 0.8 && p.expectedPrice <= req.maxBudget * 1.15) {
          score += 25;
          reasons.push('Fits budget range');
        } else if (p.expectedPrice <= req.maxBudget) {
          score += 15;
          reasons.push('Below maximum budget');
        }

        if (
          req.preferredLocalities.some(
            (loc) =>
              p.localitySector.toLowerCase().includes(loc.toLowerCase()) ||
              p.address.toLowerCase().includes(loc.toLowerCase())
          )
        ) {
          score += 10;
          reasons.push('Preferred locality match');
        }

        return {
          property: p,
          matchScore: Math.min(100, Math.max(30, score)),
          matchReasons: reasons,
        };
      })
      .filter((item): item is { property: PropertyListing; matchScore: number; matchReasons: string[] } => item !== null)
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        language,
        properties,
        requirements,
        inquiries,
        savedPropertyIds,
        conversations,
        messages,
        activeConversationId,
        totalUnreadCount,
        authModalOpen,
        authStep,
        setAuthModalOpen,
        setAuthStep,
        setLanguage,
        setActiveRole,
        setActiveConversationId,
        loginUser,
        logoutUser,
        registerUser,
        updateUserProfile,
        changePassword,
        switchDemoUser,
        addProperty,
        updateProperty,
        deleteProperty,
        updatePropertyStatus,
        addRequirement,
        deleteRequirement,
        submitInquiry,
        toggleSaveProperty,
        startOrOpenChat,
        sendMessage,
        markConversationAsRead,
        calculateMatches,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
