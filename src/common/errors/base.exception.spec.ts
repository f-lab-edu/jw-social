import { BaseException } from './base.exception';

describe('BaseException', () => {
  it('BaseException 인스턴스가 올바른 속성으로 생성되어야 한다', () => {
    const code = 'testCode';
    const message = 'Test message';
    const target = 'testTarget';
    const details = [{ code: 'detailCode', message: 'Detail message' }];
    const innererror = { code: 'innerCode' };

    const exception = new BaseException(
      code,
      message,
      target,
      details,
      innererror,
    );

    expect(exception.getCode()).toBe(code);
    expect(exception.message).toBe(message);
    expect(exception.getTarget()).toBe(target);
    expect(exception.getDetails()).toEqual(details);
    expect(exception.getInnerError()).toEqual(innererror);
  });
});
