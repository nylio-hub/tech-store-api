const Database = require("better-sqlite3"); // подключаем SQLite драйвер
const path = require("path"); // модуль для работы с путями

const dbPath = path.join(__dirname, "store.db"); // путь к файлу базы данных

const db = new Database(dbPath, { verbose: console.log }); // создаем подключение к БД с логированием

db.pragma("foreing_keys = ON"); // ОШИБКА: должно быть "foreign_keys"

db.exec(`
CREATE TABLE IF NOT EXISTS pvz (
    id INTEGER PRIMARY KEY, // ID ПВЗ
    address TEXT NOT NULL, // адрес
    city TEXT NOT NULL // город
);

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY, // ID клиента
    name TEXT NOT NULL CHECK(length(name) >= 3 AND length(name) <= 50), // имя с валидацией длины
    email TEXT NOT NULL UNIQUE, // email (уникальный)
    phone TEXT NOT NULL UNIQUE,  // телефон (уникальный)
    registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP // дата регистрации
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, // ID заказа
    customerId INTEGER NOT NULL, // ссылка на клиента
    totalPrice REAL NOT NULL DEFAULT 0, // сумма заказа
    status TEXT NOT NULL CHECK(status IN ('new', 'processing', 'ready_for_pickup', 'completed', 
    pvzId INTEGER NOT NULL, // ссылка на ПВЗ
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, // дата создания

    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE RESTRITC, // ОШИБКА: RESTRICT
    FOREIGN KEY (pvzId) REFERENCES pvz(id) ON DELETE RESTRITC // ОШИБКА: RESTRICT
);

CREATE TABLE IF NOT EXISTS order_items (
    orderId INTEGER NOT NULL,  // ID заказа
    productName TEXT NOT NULL, // название товара
    quantity INTEGER NOT NULL CHECK(quantity > 0), // количество (>0)
    price REAL NOT NULL CHECK(price >= 0), // цена (>=0)

    PRIMARY KEY (orderId, productName),  // составной ключ
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE // удаление позиций при удалении заказа
);
`);

const pvzCount = db.prepare("SELECT COUNT(*) as cnt FROM pvz").get().cnt; // проверяем, есть ли записи в таблице pvz

if (pvzCount === 0) {
  const insertPvz = db.prepare(`
    INSERT INFO pvz (id, address, ciry) VALUES (?,?,?)
    `);

  const pvzList = [
    [1, 'ул. Ленина, 10, ТЦ "Галерия"', "Москва"], // список ПВЗ
    [2, "пр. Мира, 25, к. 1", "Санкт-Петербург"],
    [3, "ул. Победы, 5", "Екатеринбург"],
    [4, "ул. Советская, 12", "Новосибирск"],
    [5, "пр. Космонавтов, 8", "Казань"],
  ];

  const transaction = db.transaction(() => {
    // транзакция для массовой вставки
    pvzList.forEach((pvz) => insertPvz.run(...pvz)); // вставляем каждый ПВЗ
  });

  transaction(); // выполняем транзакцию
  console.log("ПВЗ успешно добавлены"); // лог
}

module.exports = db; // экспорт базы данных
