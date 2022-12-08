function sleep(ms: number): void {
  new Promise((r) => setTimeout(r, ms));
}

function buildAPIResponse(message: string, data?: any) {
  return {
    status: 'success',
    message,
    data: typeof data == 'boolean' || data ? data : null,
  };
}

function buildErrorResponse(message: string, errors?: any) {
  return {
    status: 'failed',
    message,
    errors: errors.map((err) => err.message),
  };
}

class ExposableError extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'ExposableError';
  }

  toString() {
    let message =
      typeof this.message === 'string'
        ? this.message
        : JSON.stringify(this.message);
    //   this.stack[]
    return `Recognised Error (${this.name}) - ${message}`;
  }
}

export { buildAPIResponse, buildErrorResponse, sleep, ExposableError };
