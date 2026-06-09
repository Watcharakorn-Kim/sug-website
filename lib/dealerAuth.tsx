'use client';
import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// ── Auth Context ──────────────────────────────────────────────────────────
interface DealerUser {
  id: string;
  name: string;
  company: string;
  province: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  creditLimit: number;
  creditUsed: number;
}

interface AuthCtx {
  user: DealerUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Mock dealer accounts (in real app: Firebase Auth + Firestore)
const MOCK_DEALERS: Record<string, { password: string; user: DealerUser }> = {
  'dealer01': {
    password: 'sug2024',
    user: { id: 'D001', name: 'คุณสมชาย รักไทย', company: 'ห้างหุ้นส่วน สมชายวัสดุ', province: 'กรุงเทพมหานคร', tier: 'gold', creditLimit: 500000, creditUsed: 180000 },
  },
  'dealer02': {
    password: 'sug2024',
    user: { id: 'D002', name: 'คุณวิไล ก้าวหน้า', company: 'บริษัท วิไลก่อสร้าง จำกัด', province: 'เชียงใหม่', tier: 'silver', creditLimit: 200000, creditUsed: 45000 },
  },
  'demo': {
    password: 'demo',
    user: { id: 'D099', name: 'Demo Account', company: 'SUG Demo Dealer', province: 'กรุงเทพมหานคร', tier: 'bronze', creditLimit: 50000, creditUsed: 5000 },
  },
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
});

export function DealerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DealerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage
    try {
      const saved = localStorage.getItem('sug_dealer_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const account = MOCK_DEALERS[username.toLowerCase()];
    if (!account || account.password !== password) return false;
    setUser(account.user);
    localStorage.setItem('sug_dealer_user', JSON.stringify(account.user));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sug_dealer_user');
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export const useDealerAuth = () => useContext(AuthContext);

// ── Tier helpers ─────────────────────────────────────────────────────────
export const TIER_CONFIG = {
  bronze:   { label: 'Bronze', color: '#cd7f32', discount: 5,  bg: '#FEF3C7' },
  silver:   { label: 'Silver', color: '#9ca3af', discount: 10, bg: '#F3F4F6' },
  gold:     { label: 'Gold',   color: '#f59e0b', discount: 15, bg: '#FFFBEB' },
  platinum: { label: 'Platinum', color: '#8b5cf6', discount: 20, bg: '#F5F3FF' },
} as const;
