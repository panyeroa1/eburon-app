export async function askOllama(prompt: string) {
  const response = await fetch('http://3.132.84.78:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
}
