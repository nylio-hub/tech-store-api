class AppError extends Error {
  // создаем кастомный класс ошибки
  constructor(message, statusCode) {
    super(message); // передаем сообщение в родительский класс Error
    this.statusCode = statusCode; // HTTP статус код (например 404, 500)

    this.status = `${statusCode}`.startWith("4") ? "fail" : "error";
    this.isOperational = true; // помечаем ошибку как "ожидаемую" (не критическую)

    Error.captureStackTrace(this, this.constructor); // убирает лишние уровни из stack trace (чистый стек)
  }
}

module.exports = AppError; // экспорт класса
