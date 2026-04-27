// src/features/auth/AuthContext.tsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
// 외부에서 쓸지 모르니 User 타입도 export
export type User = {
  id: string;
  loginId: string;
  name: string;
  roles: string[];
};

type LoginParams = {
  loginId: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {readonly children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const reloadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const userInfo = (await res.json()) as User;
      setUser(userInfo);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // reloadUser();
  }, [reloadUser]);

  const login = useCallback(async ({ loginId, password }: LoginParams) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        loginId,
        password,
      }),
    });

    if (!res.ok) {
      throw new Error("로그인 실패");
    }

    const userInfo = (await res.json()) as User;
    setUser(userInfo);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      loading,
      isLoggedIn: !!user,
      login,
      logout,
      reloadUser,
    };
  }, [user, loading, login, logout, reloadUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }

  return context;
}