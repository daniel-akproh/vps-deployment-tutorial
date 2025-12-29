const API = '/api/posts';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
}

export async function fetchPosts() {
  return request(API);
}

export async function fetchPostById(id) {
  return request(`${API}/${id}`);
}

export async function createPost(postData) {
  return request(API, {
    method: 'POST',
    body: JSON.stringify(postData),
  });
}

export async function updatePost(id, postData) {
  return request(`${API}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  });
}

export async function deletePost(id) {
  return request(`${API}/${id}`, {
    method: 'DELETE',
  });
}

export async function checkHealth() {
  return request('/api/health');
}
