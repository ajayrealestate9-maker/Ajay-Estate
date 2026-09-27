import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  Coins,
  User,
  TrendingUp,
  Compass,
  Sparkles,
} from 'lucide-react';

export type ActiveTabType =
  | 'marketplace'
  | 'seller_form'
  | 'buyer_reqs'
  | 'messages'
  | 'mediator_desk'
  | 'trends'
  | 'profile'
  | 'about';

interface NavbarProps {
  onOpenCalculator: () => void;
  onOpenCostModal: () => void;
  currentTab: ActiveTabType;
  setCurrentTab: (tab: ActiveTabType) => void;
  onOpenInquiry?: () => void;
  onSelectMapView?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCalculator,
  onOpenCostModal,
  currentTab,
  setCurrentTab,
  onOpenInquiry,
  onSelectMapView,
}) => {
  const {
    currentUser,
    setAuthModalOpen,
    logoutUser,
    totalUnreadCount,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E8E5DD] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => setCurrentTab('marketplace')}
            className="group flex flex-col text-left focus:outline-hidden cursor-pointer"
          >
            <span className="font-serif-luxury text-2xl sm:text-3xl font-semibold tracking-tight text-[#14181F] group-hover:text-[#C5A880] transition-colors">
              Ajay Estate
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C827A] font-medium -mt-0.5">
              Private Real Estate &amp; Advisory
            </span>
          </button>

          {/* Zone 2: Curated Navigation Links (Single Line, Text with subtle hover) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs uppercase tracking-wider font-semibold text-[#5A554E]">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`hover:text-[#14181F] transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                currentTab === 'marketplace' ? 'text-[#14181F] font-bold' : ''
              }`}
            >
              Exclusive Estates
              {currentTab === 'marketplace' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880]"></span>
              )}
            </button>

            {onSelectMapView && (
              <button
                onClick={() => {
                  setCurrentTab('marketplace');
                  onSelectMapView();
                }}
                className="hover:text-[#14181F] transition-colors whitespace-nowrap cursor-pointer py-1 relative inline-flex items-center gap-1.5"
              >
                <span>Geospatial Map</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-stone-200 text-stone-700 font-medium">
                  Split
                </span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('trends')}
              className={`hover:text-[#14181F] transition-colors whitespace-nowrap cursor-pointer py-1 relative inline-flex items-center gap-1.5 ${
                currentTab === 'trends' ? 'text-[#14181F] font-bold' : ''
              }`}
            >
              <span>Market Intelligence</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[#C5A880]/15 text-[#8A6A3F] font-mono">
                AI
              </span>
              {currentTab === 'trends' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880]"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('about')}
              className={`hover:text-[#14181F] transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                currentTab === 'about' ? 'text-[#14181F] font-bold' : ''
              }`}
            >
              About &amp; Leadership
              {currentTab === 'about' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880]"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('buyer_reqs')}
              className={`hover:text-[#14181F] transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                currentTab === 'buyer_reqs' ? 'text-[#14181F] font-bold' : ''
              }`}
            >
              Private Mandates
              {currentTab === 'buyer_reqs' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880]"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('seller_form')}
              className={`hover:text-[#14181F] transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                currentTab === 'seller_form' ? 'text-[#14181F] font-bold' : ''
              }`}
            >
              List an Estate
              {currentTab === 'seller_form' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880]"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('messages')}
              className={`hover:text-[#14181F] transition-colors whitespace-nowrap cursor-pointer py-1 relative inline-flex items-center gap-1 ${
                currentTab === 'messages' ? 'text-[#14181F] font-bold' : ''
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Inquiries</span>
              {totalUnreadCount > 0 && (
                <span className="w-4 h-4 bg-[#C5A880] text-[#14181F] rounded-full flex items-center justify-center text-[9px] font-bold">
                  {totalUnreadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCostModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#5A554E] hover:text-[#14181F] transition-colors cursor-pointer"
              title="Estimate Stamp Duty &amp; Acquisition Fees"
            >
              <Coins className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Acquisition Cost</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('profile')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                    currentTab === 'profile'
                      ? 'bg-[#14181F] text-white border-[#14181F]'
                      : 'bg-white border-[#E8E5DD] text-[#14181F] hover:border-[#C5A880]'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logoutUser}
                  className="hidden xl:block text-xs text-[#8C827A] hover:text-[#14181F] font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#14181F] bg-white border border-[#14181F] hover:bg-[#14181F] hover:text-white transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                Private Access
              </button>
            )}

            <button
              onClick={onOpenInquiry || (() => setCurrentTab('buyer_reqs'))}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#14181F] hover:bg-[#252B35] transition-all cursor-pointer whitespace-nowrap shadow-xs border border-[#14181F]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Schedule Advisory</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
