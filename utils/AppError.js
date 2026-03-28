class AppError extends Error {
  // создаём кастомный класс ошибок
  constructor(message, statusCode) {
    super(message); // передаем сообщение в родительский класс Error
    this.statusCode = statusCode; // HTTP статус код (например 404, 500)

    // Ошибка: должно быть startsWith, а не startWith
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // если код начинается с 4 → ошибка клиента (fail)
    // иначе → серверная ошибка (error)

    this.isOperational = true; // помечаем ошибку как "ожидаемую", чтобы не логировать стек как критический

    Error.captureStackTrace(this, this.constructor);
    // убирает лишние уровни из stack trace для чистоты
  }
}

module.exports = AppError; // экспортируем класс
