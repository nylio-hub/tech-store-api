const customerService = require("../services/customerService"); // сервис для работы с клиентами (бизнес-логика)
const AppError = require("../utils/AppError"); // кастомный класс ошибок

exports.getAllCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // номер страницы (по умолчанию 1)
    const limit = Math.min(parseInt(req.query.limit) || 10, 20); // лимит записей (макс 20)
    const email = req.query.email ? req.query.email.trim() : null; // фильтр по email (если есть)

    const customers = await customerService.getAll({
      page, // передаем страницу
      limit, // передаем лимит
      email, // передаем email-фильтр
    });

    res.status(200).json(customers); // возвращаем список клиентов
  } catch (err) {
    next(err); // передаем ошибку в middleware
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params; // получаем id из URL

    const customer = await customerService.getById(id); // ищем клиента по id

    if (!customer) {
      throw new AppError("Клиент не найден", 404); // если нет — выбрасываем ошибку
    }

    res.status(200).json(customer); // возвращаем клиента
  } catch (err) {
    next(err); // обработка ошибки
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const newCustomer = await customerService.create(req.body); // создаем клиента из body
    res.status(201).json(newCustomer); // возвращаем созданного клиента
  } catch (err) {
    next(err); // обработка ошибки
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params; // получаем id
    const updated = await customerService.update(id, req.body); // обновляем клиента
    res.status(200).json(updated); // возвращаем обновленные данные
  } catch (err) {
    next(err); // обработка ошибки
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params; // получаем id// получаем id
    await customerService.delete(id); // удаляем клиента
    res.status(204).send(); // успешное удаление (без тела ответа)
  } catch (err) {
    next(err); // обработка ошибки
  }
};

module.exports = exports; // экспорт всех функций
