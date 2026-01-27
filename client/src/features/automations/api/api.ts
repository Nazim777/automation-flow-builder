import { Automation, TestRun } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Automation endpoints
  async createAutomation(automation: Omit<Automation, '_id' | 'createdAt' | 'updatedAt'>): Promise<Automation> {
    const response = await fetch(`${API_URL}/automations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(automation)
    });
    return this.handleResponse<Automation>(response);
  }

  async getAutomations(): Promise<Automation[]> {
    const response = await fetch(`${API_URL}/automations`);
    return this.handleResponse<Automation[]>(response);
  }

  async getAutomation(id: string): Promise<Automation> {
    const response = await fetch(`${API_URL}/automations/${id}`);
    return this.handleResponse<Automation>(response);
  }

  async updateAutomation(id: string, automation: Partial<Automation>): Promise<Automation> {
    const response = await fetch(`${API_URL}/automations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(automation)
    });
    return this.handleResponse<Automation>(response);
  }

  async deleteAutomation(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/automations/${id}`, {
      method: 'DELETE'
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async testAutomation(id: string, email: string): Promise<{ message: string; testRunId: string; email: string }> {
    const response = await fetch(`${API_URL}/test-runs/${id}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return this.handleResponse<{ message: string; testRunId: string; email: string }>(response);
  }

  async getTestRun(id: string): Promise<TestRun> {
    const response = await fetch(`${API_URL}/test-runs/${id}`);
    return this.handleResponse<TestRun>(response);
  }

  async getAutomationTestRuns(automationId: string): Promise<TestRun[]> {
    const response = await fetch(`${API_URL}/automations/${automationId}/test-runs`);
    return this.handleResponse<TestRun[]>(response);
  }

  async healthCheck(): Promise<{ status: string; mongodb: string }> {
    const response = await fetch(`${API_URL}/health`);
    return this.handleResponse<{ status: string; mongodb: string }>(response);
  }
}

export const api = new ApiService();