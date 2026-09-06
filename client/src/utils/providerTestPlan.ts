export function getProviderTestPlan(
  provider: string,
  pendingKeys: Record<string, string>,
  isConfigured: boolean
): { canTest: boolean; keyToSave?: string } {
  const keyToSave = pendingKeys[provider]?.trim();
  if (keyToSave) return { canTest: true, keyToSave };
  return { canTest: isConfigured };
}
