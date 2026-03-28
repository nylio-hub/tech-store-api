const express = require("express"); // подключаем Express
const router = express.Router(); // создаем роутер

const orderController = require("./orderController"); // контроллер заказов
const auth = require("./auth"); // middleware для аутентификации

const {
  createOrder,
  updateOrder,
  getAllOrdersQuery,
} = require("./validators/order"); // валидаторы данных для заказов (создание, обновление, фильтры)
// Получить список заказов
router.get("/", ...getAllOrdersQuery, orderController.getAllOrders); // middleware для валидации query params (page, limit, status и т.д.), обработчик получения всех заказов

// Получить заказ по ID
router.get("/:id", orderController.getOrderById); // GET /orders/:id
// Создать новый заказ
router.post("/", auth, ...createOrder, orderController.createOrder); // проверка авторизации, middleware для валидации данных заказа, обработчик создания заказа
// Обновить существующий заказ
router.put("/:id", auth, ...updateOrder, orderController.updateOrder); // проверка авторизации, middleware для валидации данных, обработчик обновления заказа
// Удалить заказ
router.delete("/:id", auth, orderController.deleteOrder); // проверка авторизации, обработчик удаления заказа

module.exports = router; // экспортируем роутер
