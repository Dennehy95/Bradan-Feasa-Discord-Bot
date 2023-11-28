const { generateMsWaitTimes } = require("../../../../src/Events/Client/SeasonalEvents/utils");

describe('generateMsWaitTimes', () => {
  test('default generateMsWaitTimes returns two numbers between 30s and 2m', () => {
    const { msToEndOfCurrentEvent, msToNextOccurrence } = generateMsWaitTimes();

    expect(msToEndOfCurrentEvent).toBeGreaterThanOrEqual(30000);
    expect(msToEndOfCurrentEvent).toBeLessThanOrEqual(120000);
    expect(msToNextOccurrence).toBeGreaterThanOrEqual(60000);
    expect(msToNextOccurrence).toBeLessThanOrEqual(240000);
  });
  test('returns an object with valid properties and values', () => {
    const result = generateMsWaitTimes({ minMilliseconds: 1000, maxMilliseconds: 2000 });
    expect(result).toEqual(expect.objectContaining({
      msToEndOfCurrentEvent: expect.any(Number),
      msToNextOccurrence: expect.any(Number),
    }));
    expect(result.msToEndOfCurrentEvent).toBeGreaterThanOrEqual(1000);
    expect(result.msToEndOfCurrentEvent).toBeLessThanOrEqual(2000);
    expect(result.msToNextOccurrence).toBe(result.msToEndOfCurrentEvent * 2);
  });
});