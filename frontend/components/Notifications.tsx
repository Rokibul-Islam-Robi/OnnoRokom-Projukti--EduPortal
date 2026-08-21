"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (title: string, message: string, type?: "info" | "success" | "warning") => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "System Active",
    message: "Shikhon-EduProtal Enterprise Academic Session initialized.",
    timestamp: "Just now",
    type: "info",
    read: false,
  },
  {
    id: "2",
    title: "Coursework Status",
    message: "Algebra Worksheet 1 published for Class 10 A.",
    timestamp: "10m ago",
    type: "success",
    read: false,
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function addNotification(title: string, message: string, type: "info" | "success" | "warning" = "info") {
    const newItem: NotificationItem = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: "Just now",
      type,
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}

export function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 transition-all"
        title="Notifications"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink">Notifications</p>
              <p className="text-[11px] text-slate-400">{unreadCount} unread alerts</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-brand-600 hover:underline"
              >
                Read All
              </button>
              <button
                onClick={clearAll}
                className="text-[11px] font-semibold text-slate-400 hover:text-rose-600"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 transition-colors ${!n.read ? "bg-brand-50/30" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-ink">{n.title}</p>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-snug">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
