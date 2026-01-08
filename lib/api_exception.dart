class ApiException {
  const ApiException(this.message, this.statusCode);

  final String message;

  final int? statusCode;

  @override
  String toString() {
    return 'ApiException: $message (Status: $statusCode)';
  }
}
