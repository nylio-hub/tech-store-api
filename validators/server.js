const express = require("express"); // Импорт фреймворка Express для создания сервера
const cors = require("cors"); // Импорт middleware для настройки CORS (кросс-доменные запросы)
const swaggerUI = require("swagger-ui-express"); // Импорт модуля для отображения Swagger UI документации

const specs = require("./swagger"); // Импорт Swagger спецификации (описание API)
const config = require("./config"); // Импорт конфигурации приложения

const app = express(); // Создание экземпляра Express приложения

app.use(cors()); // Подключение CORS middleware для разрешения кросс-доменных запросов
app.use(express.json()); // Подключение middleware для парсинга JSON тела запроса

app.use((req, res, next) => {
  // Middleware для логирования всех входящих запросов
  const time = new Date().toISOString(); // Получение текущего времени в ISO формате
  console.log(`[${time}] ${req.method} ${req.url} - IP: ${req.ip}`); // Вывод в консоль: время, метод, URL и IP клиента
  next(); // Передача управления следующему middleware
});

app.use(
  // Подключение Swagger UI для интерактивной документации API
  "/api-docs", // Путь, по которому будет доступна документация
  swaggerUI.serve, // Middleware для отдачи статических файлов Swagger UI
  swaggerUI.setup(specs, {
    // Настройка Swagger UI с переданной спецификацией
    explorer: true, // Включение панели поиска и навигации
    swaggerOptions: {
      // Дополнительные опции Swagger
      persistAuthorization: true, // Сохранение авторизации между обновлениями страницы
    },
    customSiteTitle: "Магазин техники API Docs", // Кастомный заголовок страницы документации
  })
);

app.get("/", (req, res) => {
  // Обработчик GET запроса на корневой маршрут
  res.json({
    // Отправка JSON ответа
    message: "Добро пожаловать в API магазина техники!", // Приветственное сообщение
    docs: "/api-docs - интерактивная документация", // Ссылка на документацию API
  });
});

app.use((err, req, res, next) => {
  // Middleware для обработки ошибок (глобальный обработчик)
  console.error("Ошибка:", err.message); // Вывод сообщения об ошибке в консоль
  console.error(err.stack); // Вывод стека вызовов ошибки в консоль

  const status = typeof err.status === "number" ? err.status : 500; // Определение HTTP статуса ошибки (по умолчанию 500)

  res.status(status).json({
    // Отправка JSON ответа с ошибкой
    error: err.message || "Внутренняя ошибка сервера", // Сообщение об ошибке или стандартное сообщение
  });
});

const PORT = config.PORT || 3000; // Определение порта из конфигурации или 3000 по умолчанию
app.listen(PORT, () => {
  // Запуск HTTP сервера на указанном порту
  console.log(`Сервер запущен на http://localhost:${PORT}`); // Вывод сообщения о запуске сервера
  console.log(`Документация доступна: http://localhost:${PORT}/api-docs`); // Вывод ссылки на документацию API
});
