const API_URL = process.env.WALLET_APP_URL || 'http://127.0.0.1:7000';

export async function getData(endpoint: string) {
  const response = await fetch(`${API_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error('Falha na requisição');
  }
  return await response.json();
}

export async function postData(endpoint: string, data: Object) {
  console.log('postData', endpoint, data, API_URL);	
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Falha na requisição');
  }
  return await response.json();
}
