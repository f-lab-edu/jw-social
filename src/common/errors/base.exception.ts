export interface ErrorDetail {
  code: string;
  message: string;
  target?: string;
  details?: ErrorDetail[];
  innererror?: InnerError;
  [key: string]: any;
}

export interface InnerError {
  code?: string;
  innererror?: InnerError;
  [key: string]: any;
}

export class BaseException extends Error {
  private readonly code: string;
  private readonly target?: string;
  private readonly details?: ErrorDetail[];
  private readonly innererror?: InnerError;

  constructor(
    code: string,
    message: string,
    target?: string,
    details?: ErrorDetail[],
    innererror?: InnerError,
  ) {
    super(message);
    this.code = code;
    this.target = target;
    this.details = details;
    this.innererror = innererror;
  }

  public getCode(): string {
    return this.code;
  }

  public getTarget(): string | undefined {
    return this.target;
  }

  public getDetails(): ErrorDetail[] | undefined {
    return this.details;
  }

  public getInnerError(): InnerError | undefined {
    return this.innererror;
  }
}
