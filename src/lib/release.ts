// Static family preview. Enable connected features only after provider and backend review.
export const LIVE_SERVICES_ENABLED = false;
export const VOICE_CAPTURE_ENABLED = false;

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  if (!LIVE_SERVICES_ENABLED) throw new Error('Live services are not connected in this preview.');
  const response = await fetch(input, init);
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The connected service is unavailable.');
  }
  return response;
}
