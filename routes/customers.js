const express = require("express"); // подключаем Express
const router = express.Router(); // создаем роутер

const customerController = require("../customerController"); // контроллер клиентов
const auth = require("./auth"); // middleware аутентификации
const { createCustomer, updateCustomer } = require("../validators/customer"); // валидация данных при создании/обновлении клиента
// Получить всех клиентов
router.get("/", customerController.getAllCustomers); // GET /customers
// Получить клиента по ID
router.get("/:id", customerController.getCustomerById); // GET /customers/:id
// Создать нового клиента
router.post("/", auth, ...createCustomer, customerController.createCustomer); // проверка авторизации, массив middleware для валидации данных, обработчик создания клиента
// Обновить существующего клиента
router.put("/:id", auth, ...updateCustomer, customerController.updateCustomer); // проверка авторизации, middleware для валидации данных, обработчик обновления
// Удалить клиента
router.delete("/:id", auth, customerController.deleteCustomer); // проверка авторизации, обработчик удаления

module.exports = router; // экспортируем роутер
