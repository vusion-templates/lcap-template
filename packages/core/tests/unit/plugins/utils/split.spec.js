import { utils as codewaveUtils } from '@/plugins/utils/index.js';


describe('Split 函数', () => {
    test('Split 函数 保留末尾空串', () => {
        expect(codewaveUtils.Split('1.', '.', true))
            .toEqual(['1','']);
        expect(codewaveUtils.Split('1..', '.', true))
            .toEqual(['1','','']);
        expect(codewaveUtils.Split('1', '.', true))
            .toEqual(['1']);
    });

    test('Split 函数 舍弃末尾空串', () => {
        expect(codewaveUtils.Split('1.', '.', false))
            .toEqual(['1']);
        expect(codewaveUtils.Split('1..', '.', false))
            .toEqual(['1','']);
        expect(codewaveUtils.Split('1', '.', false))
            .toEqual(['1']);
    });
});
