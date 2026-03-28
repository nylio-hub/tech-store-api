const db = require("./db"); // база данных SQLite через better-sqlite3
const AppError = require("../utils/AppError"); // кастомный класс ошибок

/**
 * Получить список клиентов с пагинацией и фильтром по email
 * @param {Object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {string|null} options.email
 * @returns {Array} список клиентов
 */
exports.getAll = ({ page = 1, limit = 10, email = null }) => {
  const offset = (page - 1) * limit; // вычисляем смещение для пагинации

  let query = `
    SELECT id, name, email, phone, registeredAt
    FROM customers
    `;

  const params = [];

  if (email) {
    query += " WHERE email = ?"; // фильтруем по email
    params.push(email.trim());
  }

  query += " ORDER BY registeredAt DESC LIMIT ? OFFSET ?"; // сортировка и лимит
  params.push(limit, offset);

  const stmt = db.prepare(query);
  return stmt.all(...params); // выполняем запрос и возвращаем все строки
};

/**
 * Получить клиента по ID
 * @param {number|string} id
 * @returns {Object|null}
 */
exports.getById = (id) => {
  const stmt = db.prepare(`
    SELECT id, name, email, phone, registeredAt
    FROM customers
    WHERE id = ?
    `);

  return stmt.get(id); // возвращаем один объект или null
};

/**
 * Создать нового клиента
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.phone
 * @returns {Object} созданный клиент
 * @throws AppError если email уже существует
 */
exports.create = (data) => {
  const { name, email, phone } = data;

  // проверяем уникальность email
  const existing = db
    .prepare("SELECT id FROM customers WHERE email = ?")
    .get(email);
  if (existing) {
    throw new AppError("Клиент с таким email уже существует", 400);
  }

  // вставляем нового клиента
  const insertStmt = db.prepare(
    "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)"
  );
  const info = insertStmt.run(name, email, phone);

  // возвращаем созданного клиента
  const newCustomer = db
    .prepare(
      `
      SELECT id, name, email, phone, registeredAt
      FROM customers
      WHERE id = ?
    `
    )
    .get(info.lastInsertRowid);

  return newCustomer;
};

/**
 * Обновить клиента по ID
 * @param {number} id
 * @param {Object} data
 */
exports.update = (id, data) => {
  const { name, email, phone } = data;

  const updates = [];
  const params = [];

  if (name) {
    updates.push("name = ?");
    params.push(name);
  }

  if (email) {
    // проверяем уникальность email (кроме текущего клиента)
    const existing = db
      .prepare("SELECT id FROM customers WHERE email = ? AND id != ?")
      .get(email, id);
    if (existing) {
      throw new AppError("Клиент c таким email уже существует", 400);
    }
    updates.push("email = ?");
    params.push(email);
  }

  if (phone) {
    updates.push("phone = ?");
    params.push(phone);
  }

  if (!updates.length) {
    throw new AppError("Не указаны поля для обновления", 400);
  }

  params.push(id);

  // ПРОБЛЕМА: строка с $updates.join(", ") не работает в sqlite
  // правильный способ: динамически формировать строку через шаблон
  const stmt = db.prepare(`
      UPDATE customers
      SET ${updates.join(", ")} 
      WHERE id = ?
    `);

  const info = stmt.run(...params);

  if (info.changes === 0) {
    throw new AppError("Клиент не найден", 404);
  }

  return exports.getById(id); // возвращаем обновленного клиента
};

/**
 * Удалить клиента
 * @param {number} id
 */
exports.delete = (id) => {
  const customer = db.prepare("SELECT id FROM customers WHERE id = ?").get(id);
  if (!customer) {
    throw new AppError("Клиент не найден", 404);
  }

  // проверяем, есть ли активные заказы
  const hasOrders = db
    .prepare("SELECT 1 FROM orders WHERE customerId = ?")
    .get(id);
  if (hasOrders) {
    throw new AppError("Невозможно удалить клиента с активными заказами", 409);
  }

  db.prepare("DELETE FROM customers WHERE id = ?").run(id); // удаляем клиента
};
