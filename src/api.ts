// Mumaa API Utility
export const API_URL = 'https://mumaa-api.srisumit96.workers.dev'; // Placeholder - Update with your actual Worker URL

export const api = {
  async post(path: string, data: any) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async get(path: string) {
    const response = await fetch(`${API_URL}${path}`);
    return response.json();
  }
};
