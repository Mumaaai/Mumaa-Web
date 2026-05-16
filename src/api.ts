// Mumaa API Utility
export const API_URL = import.meta.env.VITE_API_URL ?? 'https://mumaa-api.srisumit96-1ca.workers.dev';

export const api = {
  getHeaders() {
    const session = localStorage.getItem('mumaa_session');
    const user = session ? JSON.parse(session) : null;
    return {
      'Content-Type': 'application/json',
      'X-Staff-ID': user?.id || ''
    };
  },

  async post(path: string, data: any) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async put(path: string, data: any) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async get(path: string) {
    const response = await fetch(`${API_URL}${path}`, {
      headers: this.getHeaders()
    });
    return response.json();
  },
  
  async delete(path: string, data?: any) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    return response.json();
  }
};
