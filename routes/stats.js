const express = require("express"); // подключаем Express
const router = express.Router(); // создаем роутер

const orderController = require("./orderController"); // контроллер заказов
const auth = require("./auth"); // middleware для аутентификации
// Получить статистику по заказам
router.get("/", auth, orderController.getStats); // проверка авторизации — только авторизованные пользователи могут видеть статистику, обработчик запроса

module.exports = router; // экспортируем роутер
