import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Database } from "@/integrations/supabase/types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setNotifications(data || []);
<<<<<<< HEAD
      setError(null);
    } catch (err) {
      console.error("[useNotifications] Error fetching notifications:", err);
=======
    } catch (err) {
      console.error("Error fetching notifications:", err);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      setError(err instanceof Error ? err : new Error("Failed to fetch notifications"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

<<<<<<< HEAD
    console.log("[useNotifications] Setting up real-time subscription for user:", user.id);
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
<<<<<<< HEAD
          console.log("[useNotifications] New notification received:", payload.new);
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
<<<<<<< HEAD
          console.log("[useNotifications] Notification updated:", payload.new);
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n))
          );
        }
      )
<<<<<<< HEAD
      .subscribe((status) => {
        console.log("[useNotifications] Subscription status:", status);
      });

    return () => {
      console.log("[useNotifications] Cleaning up subscription");
=======
      .subscribe();

    return () => {
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ status: "read" })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, status: "read" as const } : n))
      );
    } catch (err) {
<<<<<<< HEAD
      console.error("[useNotifications] Error marking notification as read:", err);
      throw err;
=======
      console.error("Error marking notification as read:", err);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ status: "read" })
        .eq("user_id", user.id)
        .eq("status", "unread");

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "read" as const }))
      );
    } catch (err) {
<<<<<<< HEAD
      console.error("[useNotifications] Error marking all notifications as read:", err);
      throw err;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("[useNotifications] Error deleting notification:", err);
      throw err;
=======
      console.error("Error marking all notifications as read:", err);
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    }
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
<<<<<<< HEAD
    deleteNotification,
=======
>>>>>>> 031c161bf7b91941f5f0d649b9170bfe406ca241
    refetch: fetchNotifications,
  };
}
