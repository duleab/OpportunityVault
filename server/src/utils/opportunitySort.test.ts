import { describe, expect, it } from 'vitest';
import { sortOpportunities } from './opportunitySort.js';

const rows = [
  { name: 'Later', countries: ['Vietnam'], deadline: '2027-02-01T00:00:00.000Z', urgency: { daysLeft: 20 } },
  { name: 'Sooner', countries: ['Cambodia'], deadline: '2027-01-01T00:00:00.000Z', urgency: { daysLeft: 3 } },
  { name: 'No deadline', countries: [], deadline: null, urgency: { daysLeft: null } },
];

describe('sortOpportunities', () => {
  it('sorts countries by their displayed country text', () => {
    const result = sortOpportunities(rows, 'countries', 'asc');
    expect(result.map((row) => row.name)).toEqual(['No deadline', 'Sooner', 'Later']);
  });

  it('sorts days left numerically and places missing deadlines last', () => {
    const result = sortOpportunities(rows, 'daysLeft', 'asc');
    expect(result.map((row) => row.name)).toEqual(['Sooner', 'Later', 'No deadline']);
  });

  it('reverses the requested sort without moving missing deadlines ahead of dated rows', () => {
    const result = sortOpportunities(rows, 'daysLeft', 'desc');
    expect(result.map((row) => row.name)).toEqual(['Later', 'Sooner', 'No deadline']);
  });
});
