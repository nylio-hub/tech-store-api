const express = require("express"); // подключаем Express
const router = express.Router(); // создаем роутер
const db = require("./db"); // подключаем базу данных (better-sqlite3)
// Получить список всех ПВЗ
router.get("/", (req, res, next) => {
  try {
    // Получаем все записи из таблицы pvz, сортируем по городу и адресу
    const pvz = db.prepare("SELECT * FROM pvz ORDER BY city, address").all();
    res.json(pvz); // возвращаем результат в формате JSON
  } catch (err) {
    next(err); // передаем ошибку в глобальный обработчик ошибок
  }
});

module.exports = router; // экспортируем роутер
