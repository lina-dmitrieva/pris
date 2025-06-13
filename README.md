## GraphQL API с микросервисами

# О проекте
Реализована система микросервисов, построенная с использованием Apollo. Каждый подграф (Users, Orders, Products) реализует часть схемы GraphQL, которая объединяется через центральный Apollo Gateway. Проект позволяет взаимодействовать с пользователями, заказами и продуктами через единый GraphQL API.

# Что сделано
- Реализован Apollo Gateway, объединяющий схемы подграфов.

- Создан подграф Users со следующими возможностями:
  - Получение списка пользователей и одного пользователя по ID.
  - Создание, обновление и удаление пользователей.

- Создан подграф Orders с поддержкой:
  - Получения заказов и добавления новых заказов.
  -Связи заказов с пользователями и продуктами.

- Создан подграф Products, предоставляющий:
  - Список товаров и операции над ними.

- Вся структура объединена в единую схему на Gateway.

# Установка и запуск
1. Установить зависимости
```bash
cd gateway && npm install
cd ../users && npm install
cd ../orders && npm install
cd ../products && npm install
```
2. Запустить сервисы
Каждый сервис запускается в отдельном окне терминала:

```bash
cd users && node index.js        # порт 4001
cd orders && node index.js       # порт 4002
cd products && node index.js     # порт 4003
cd gateway && node index.js      # порт 4000
```

3. Использование
Перейдите в браузере по адресу:
http://localhost:4001/

Введите GraphQL-запрос, например:

```graphql
query {
  users {
    id
    name
    email
  }
}
```
Вы сможете получить список всех пользователей, зарегестрированных в системе
# Пример схем
Users
```graphql
type User @key(fields: "id") {
  id: ID!
  name: String
  email: String
}

type Query {
  users: [User]
  user(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!): User
  updateUser(id: ID!, name: String, email: String): User
  deleteUser(id: ID!): Boolean
}
```

# Демонстрация и видео
Видео с работой: https://disk.yandex.ru/i/D36NBMI-GFagpw



