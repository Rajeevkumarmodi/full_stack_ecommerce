class ApiResponse {
  constructor(statusCode, message, success, data = {}) {
    (this.statusCode = statusCode),
      (this.data = data),
      (this.message = message),
      (this.success = success);
  }
}

export { ApiResponse };
