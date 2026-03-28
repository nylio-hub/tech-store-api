const orderService = require("../../services/orderService"); // сервис для работы с заказами
const AppError = require("./utils/AppError"); // кастомный класс ошибок

exports.getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // текущая страница (по умолчанию 1)
    const limit = Math.min(parseInt(req.query.limit) || 10, 20); // лимит записей (макс 20)
    const status = req.query.status || null; // фильтр по статусу заказа
    const pvzId = req.query.pvzId ? parseInt(req.query.pvzId) : null; // фильтр по ID ПВЗ

    const orders = await orderService.getAll({ page, limit, status, pvzId }); // получаем список заказов

    res.status(200).json(orders); // отправляем ответ клиенту
  } catch (err) {
    next(err); // передаем ошибку в middleware
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params; // получаем id заказа из URL
    const order = await orderService.getById(id); // ищем заказ

    if (!order) throw new AppError("Заказ не найден", 404); // если нет — ошибка

    res.status(200).json(order); // возвращаем заказ
  } catch (err) {
    next(err); // обработка ошибки
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.create(req.body); // создаем заказ из тела запроса
    res.status(201).json(order); // возвращаем созданный заказ
  } catch (err) {
    next(err); // обработка ошибки
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params; // получаем id
    const updated = await orderService.update(id, req.body); // обновляем заказ
    res.status(200).json(updated); // возвращаем обновленный заказ
  } catch (err) {
    next(err); // обработка ошибки
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params; // получаем id
    await orderService.delete(id); // удаляем заказ
    res.status(204).send(); // успешное удаление (без тела)
  } catch (err) {
    next(err); // обработка ошибки
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await orderService.getStats(); // получаем статистику заказов
    res.status(200).json(stats); // отправляем статистику
  } catch (err) {
    next(err); // обработка ошибки
  }
};

module.exports = exports; // экспортируем все методы
