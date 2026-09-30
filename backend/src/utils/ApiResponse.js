class ApiResponse {
  constructor(statusCode, message = "Success", data = null) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;