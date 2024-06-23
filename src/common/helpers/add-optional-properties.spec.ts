import { addOptionalProperties } from './add-optional-properties';

describe('addOptionalProperties', () => {
  describe.each([
    [
      { a: 1, b: 2 },
      { b: undefined, c: 3 },
      { a: 1, b: 2, c: 3 },
      '정의된 속성을 추가해야 한다',
    ],
    [
      { a: 1, b: 2 },
      { b: undefined, c: undefined },
      { a: 1, b: 2 },
      '정의되지 않은 속성은 추가하지 않아야 한다',
    ],
    [
      { a: 1, b: 2 },
      { b: 3, c: 4 },
      { a: 1, b: 3, c: 4 },
      'properties에 정의된 속성이 baseObject의 속성을 덮어써야 한다',
    ],
    [{ a: 1, b: 2 }, {}, { a: 1, b: 2 }, '빈 properties 객체를 처리해야 한다'],
    [{}, { a: 1, b: 2 }, { a: 1, b: 2 }, '빈 baseObject를 처리해야 한다'],
    [{}, {}, {}, 'baseObject와 properties가 모두 비어있을 때 처리해야 한다'],
  ])('%s', (baseObject, properties, expectedResult, description) => {
    it(description, () => {
      const result = addOptionalProperties(baseObject, properties);

      expect(result).toEqual(expectedResult);
    });
  });

  it('새로운 객체를 반환하고 baseObject를 변경하지 않아야 한다', () => {
    const baseObject = { a: 1, b: 2 };
    const properties = { b: 3, c: 4 };

    const result = addOptionalProperties(baseObject, properties);

    expect(result).not.toBe(baseObject);
    expect(baseObject).toEqual({ a: 1, b: 2 });
  });
});
