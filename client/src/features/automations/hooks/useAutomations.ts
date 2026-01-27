import { useState, useEffect, useCallback } from "react";
import { Automation } from "../types";
import { api } from "../api/api";

export const useAutomations = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAutomations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAutomations();
      setAutomations(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to load automations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAutomations();
  }, [loadAutomations]);

  const createAutomation = async (
    automation: Omit<Automation, "_id" | "createdAt" | "updatedAt">,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const created = await api.createAutomation(automation);
      setAutomations((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAutomation = async (id: string, updates: Partial<Automation>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.updateAutomation(id, updates);
      setAutomations((prev) => prev.map((a) => (a._id === id ? updated : a)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAutomation = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteAutomation(id);
      setAutomations((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const testAutomation = async (id: string, email: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.testAutomation(id, email);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    automations,
    loading,
    error,
    loadAutomations,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    testAutomation,
  };
};
