type ProviderFailure = {
  response?: { status?: number };
  code?: string;
  message?: string;
};

export function getProviderTestError(providerLabel: string, error: unknown): {
  statusCode: number;
  message: string;
} {
  const failure = (error ?? {}) as ProviderFailure;
  const status = failure.response?.status;

  if (status === 401 || status === 403) {
    return {
      statusCode: 400,
      message: `${providerLabel} rejected the API key. Check that the key is active and belongs to the correct provider.`,
    };
  }
  if (status === 429) {
    return { statusCode: 429, message: `${providerLabel} quota or rate limit was reached. Check the provider account and try again.` };
  }
  if (status === 404) {
    return { statusCode: 502, message: `${providerLabel} could not find the configured model. The provider model may be unavailable.` };
  }
  if (failure.code === 'ECONNABORTED' || /timed out/i.test(failure.message ?? '')) {
    return { statusCode: 504, message: `${providerLabel} test timed out. Try again in a moment.` };
  }
  if (['ENOTFOUND', 'ECONNREFUSED', 'EAI_AGAIN'].includes(failure.code ?? '')) {
    return { statusCode: 502, message: `${providerLabel} could not be reached from the server.` };
  }
  return { statusCode: 502, message: `${providerLabel} test failed. Check the provider account, key permissions, and model access.` };
}
