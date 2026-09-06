export function getProviderTestPlan(
  provider: string,
  pendingKeys: Record<string, string>,
  _isConfigured: boolean
): { canTest: boolean; keyToSave?: string } {
  const keyToSave = pendingKeys[provider]?.trim();
  if (keyToSave) return { canTest: true, keyToSave };
  return { canTest: true };
}
