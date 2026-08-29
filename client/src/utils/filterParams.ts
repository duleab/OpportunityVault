export type FilterParamUpdates = Record<string, string | null | undefined>;

export function updateFilterParams(
  current: URLSearchParams,
  updates: FilterParamUpdates
): URLSearchParams {
  const next = new URLSearchParams(current);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') next.delete(key);
    else next.set(key, value);
  });

  if (!Object.prototype.hasOwnProperty.call(updates, 'page')) next.delete('page');
  return next;
}
