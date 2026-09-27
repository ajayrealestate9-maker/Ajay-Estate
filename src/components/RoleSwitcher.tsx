import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShoppingBag, Briefcase, CheckCircle2, User, MapPin } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSwitcherProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onSelectRole }) => {
  const { currentUser, activeRole, setActiveRole, language, setAuthModalOpen } = useApp();

  const handleRoleClick = (role: UserRole) => {
    setActiveRole(role);
    onSelectRole(role);
  };

  return (
    <div className="bg-white border-b border-stone-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Current Active Hat & User Context */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-sm shrink-0">
            {currentUser?.name ? currentUser.name[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Logged in as:</span>
              <span className="text-xs font-bold text-stone-900">{currentUser?.name || 'Guest User'}</span>
              {currentUser && (
                <span className="text-[11px] text-stone-500 flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {currentUser.city}, {currentUser.state}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600">
              {activeRole === 'seller' && (language === 'pa' ? 'ਤੁਸੀਂ ਪ੍ਰਾਪਰਟੀ ਵੇਚਣ ਵਾਲੇ (Seller) ਦੇ ਤੌਰ ਤੇ ਲਿਸਟ ਕਰ ਸਕਦੇ ਹੋ' : 'Active Mode: Seller (List Land, Plot, Kothi, SCO, Flat)')}
              {activeRole === 'buyer' && (language === 'pa' ? 'ਤੁਸੀਂ ਖਰੀਦਦਾਰ (Buyer) ਦੇ ਤੌਰ ਤੇ ਸਮੇਂ ਦੀ ਮੰਗ ਦਰਜ ਕਰ ਸਕਦੇ ਹੋ' : 'Active Mode: Buyer (Search & Post Requirement / ਸਮੇਂ ਦੀ ਮੰਗ)')}
              {activeRole === 'mediator' && (language === 'pa' ? 'ਤੁਸੀਂ ਪ੍ਰਾਪਰਟੀ ਵਿਚੋਲਾ / ਡੀਲਰ (Mediator) ਦੇ ਤੌਰ ਤੇ ਸੌਦੇ ਕਰਵਾ ਸਕਦੇ ਹੋ' : 'Active Mode: Mediator / Dealer (Brokerage, Matchmaking & Deals)')}
            </p>
          </div>
        </div>

        {/* Right: Explicit 3 "Act As" Role Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-medium self-start md:self-auto">
          <span className="text-stone-500 px-2 hidden sm:inline-block">Act As:</span>
          
          <button
            onClick={() => handleRoleClick('seller')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeRole === 'seller'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'pa' ? 'ਵੇਚਣ ਵਾਲਾ (Seller)' : 'Seller'}</span>
          </button>

          <button
            onClick={() => handleRoleClick('buyer')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeRole === 'buyer'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'pa' ? 'ਖਰੀਦਦਾਰ (Buyer)' : 'Buyer'}</span>
          </button>

          <button
            onClick={() => handleRoleClick('mediator')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeRole === 'mediator'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{language === 'pa' ? 'ਵਿਚੋਲਾ (Mediator)' : 'Mediator / Agent'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
