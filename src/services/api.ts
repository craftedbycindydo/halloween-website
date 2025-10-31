import { Contestant, Vote } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Generate device fingerprint
export const generateDeviceId = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('device', 2, 2);
  }
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvas.toDataURL()
  };
  
  return btoa(JSON.stringify(fingerprint)).substring(0, 64);
};

// Get or create device ID
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('halloween_device_id');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('halloween_device_id', deviceId);
  }
  return deviceId;
};

const deviceId = getDeviceId();

// Contestants API
export const contestantsAPI = {
  async getAll(): Promise<Contestant[]> {
    const response = await fetch(`${API_BASE}/contestants`);
    if (!response.ok) throw new Error('Failed to fetch contestants');
    return response.json();
  },

  async add(contestant: Omit<Contestant, 'id'> & { id: string }, adminPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE}/contestants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...contestant, adminPassword })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add contestant');
    }
  },

  async delete(id: string, adminPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE}/contestants`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, adminPassword })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete contestant');
    }
  }
};

// Votes API
export const votesAPI = {
  async getCounts(): Promise<{ contestantId: string; count: number }[]> {
    const response = await fetch(`${API_BASE}/votes`);
    if (!response.ok) throw new Error('Failed to fetch vote counts');
    return response.json();
  },

  async getAll(adminPassword: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/votes?adminPassword=${encodeURIComponent(adminPassword)}`);
    if (!response.ok) throw new Error('Failed to fetch votes');
    return response.json();
  },

  async checkStatus(): Promise<{ hasVoted: boolean; vote: Vote | null }> {
    const response = await fetch(`${API_BASE}/votes?checkStatus=1`, {
      headers: { 'X-Device-ID': deviceId }
    });
    if (!response.ok) throw new Error('Failed to check vote status');
    return response.json();
  },

  async submit(contestantId: string, voterName: string): Promise<{ message: string; changed: boolean; locked: boolean }> {
    const response = await fetch(`${API_BASE}/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': deviceId
      },
      body: JSON.stringify({ contestantId, voterName })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit vote');
    }
    
    return data;
  }
};

