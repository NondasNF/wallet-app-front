const API_URL = process.env.WALLET_APP_API_URL || 'http://127.0.0.1:7000';

export async function getData(endpoint: string, headers: HeadersInit = {}) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  console.log(response);
  if (response.status === 401) {
    throw new Error('Não autorizado');
  }
  return await response.json();
}

export async function postData(endpoint: string, data: Object, headers: HeadersInit = {}) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
  if (response.status === 401) {
    throw new Error('Não autorizado');
  }
  return await response.json();
}

export async function putData(endpoint: string, data: Object, headers: HeadersInit = {}) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
  if (response.status === 401) {
    throw new Error('Não autorizado');
  }
  return await response.json();
}
