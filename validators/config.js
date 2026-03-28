module.exports = {
  PORT: process.env.PORT || 3000, // порт сервера, по умолчанию 3000

  ITEMS_PER_PAGE: 10, // количество элементов по умолчанию на страницу
  MAX_ITEMS_PER_PAGE: 20, // максимальное количество элементов на страницу

  ORDER_STATUSES: [
    "new", // новый заказ
    "processing", // в обработке
    "ready_for_pickup", // готов к выдаче
    "completed", // завершён
    "canceled", // отменён
  ],

  API_PREFIX: "/api", // префикс для всех API роутов

  ADMIN_CREDENTIALS: {
    username: "admin", // логин администратора
    password: "secret", // пароль администратора
  },

  DEFAULT_PHONE_REGEX: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
  // регулярное выражение для проверки формата телефона +7(999)999-99-99

  MIN_NAME_LENGTH: 3, // минимальная длина имени
  MAX_NAME_LENGTH: 50, // максимальная длина имени

  STATS_CACHE_TTL: 60 * 1000, // время жизни кэша статистики в миллисекундах (1 минута)
};
