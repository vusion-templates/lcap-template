import { utils as u } from '@/init/utils';

describe('FormatNumber 函数', () => {
    test('FormatNumber', () => {
        expect(u.FormatNumber('1.005', 2, false, false, false, false)).toBe('1.01');
        expect(u.FormatNumber('1.00', 2, true, false, false, false)).toBe('1');
        expect(u.FormatNumber('1.001005', 3, true, false, false, false)).toBe('1.001');
        expect(u.FormatNumber('1.001005', 4, true, false, false, false)).toBe('1.001');
        expect(u.FormatNumber('1.001005', 4, false, false, false, false)).toBe('1.0010');
    });
});
