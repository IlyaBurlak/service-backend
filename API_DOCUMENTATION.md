# API Документация

База URL: `http://localhost:3000` (или значение из переменной окружения `PORT`)

## Аутентификация

Большинство эндпоинтов требуют JWT токен в заголовке `Authorization`:
```
Authorization: Bearer <access_token>
```

---

## 1. Авторизация (Auth)

### POST `/auth/login`
Вход пользователя

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ошибки:**
- `401 Unauthorized` - Неверные учетные данные

---

### POST `/auth/register`
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван",
  "surname": "Иванов"
}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван",
  "surname": "Иванов",
  "isGuest": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### POST `/auth/register/guest`
Регистрация гостевого пользователя

**Тело запроса:** Отсутствует

**Ответ (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "name": "Гость",
  "surname": ""
}
```

---

### GET `/auth/me`
Получить информацию о текущем авторизованном пользователе

**Требуется авторизация:** ✅

**Ответ (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван",
  "surname": "Иванов",
  "isGuest": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `404 Not Found` - Пользователь не найден

---

## 2. Пользователи (Users)

### GET `/users`
Получить список всех пользователей

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван",
    "surname": "Иванов",
    "isGuest": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/users/:id`
Получить пользователя по ID

**Параметры:**
- `id` (number) - ID пользователя

**Ответ (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван",
  "surname": "Иванов",
  "isGuest": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Ошибки:**
- `404 Not Found` - Пользователь не найден

---

### POST `/users`
Создать нового пользователя (административная функция)

**Примечание:** Для обычной регистрации используйте `/auth/register`

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван",
  "surname": "Иванов",
  "isGuest": false
}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван",
  "surname": "Иванов",
  "isGuest": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PUT `/users/:id`
Обновить информацию о пользователе

**Требуется авторизация:** ✅  
**Ограничение:** Можно обновлять только свой профиль

**Параметры:**
- `id` (number) - ID пользователя

**Тело запроса:**
```json
{
  "name": "Петр",
  "surname": "Петров",
  "email": "newemail@example.com"
}
```

**Примечание:** Поле `password` автоматически исключается из обновления для безопасности

**Ответ (200 OK):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "name": "Петр",
  "surname": "Петров",
  "isGuest": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `403 Forbidden` - Попытка обновить чужой профиль
- `404 Not Found` - Пользователь не найден

---

### DELETE `/users/:id`
Удалить пользователя

**Требуется авторизация:** ✅  
**Ограничение:** Можно удалить только свой аккаунт

**Параметры:**
- `id` (number) - ID пользователя

**Ответ (200 OK):**
```json
{
  "success": true
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `403 Forbidden` - Попытка удалить чужой аккаунт
- `404 Not Found` - Пользователь не найден

---

## 3. Проекты (Projects)

### GET `/projects`
Получить список всех проектов

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Мой проект",
    "image": "https://example.com/image.jpg",
    "imageBig": "https://example.com/image-big.jpg",
    "github": "https://github.com/user/repo",
    "linkOnDeploy": "https://deploy.example.com",
    "link": "https://example.com",
    "filter": "web",
    "tags": [
      {
        "id": 1,
        "name": "React"
      },
      {
        "id": 2,
        "name": "TypeScript"
      }
    ]
  }
]
```

---

### GET `/projects/:id`
Получить проект по ID

**Параметры:**
- `id` (number) - ID проекта

**Ответ (200 OK):**
```json
{
  "id": 1,
  "title": "Мой проект",
  "image": "https://example.com/image.jpg",
  "imageBig": "https://example.com/image-big.jpg",
  "github": "https://github.com/user/repo",
  "linkOnDeploy": "https://deploy.example.com",
  "link": "https://example.com",
  "filter": "web",
  "tags": [
    {
      "id": 1,
      "name": "React"
    }
  ]
}
```

**Ошибки:**
- `404 Not Found` - Проект не найден

---

### POST `/projects`
Создать новый проект

**Требуется авторизация:** ✅

**Тело запроса:**
```json
{
  "title": "Новый проект",
  "image": "https://example.com/image.jpg",
  "imageBig": "https://example.com/image-big.jpg",
  "github": "https://github.com/user/repo",
  "linkOnDeploy": "https://deploy.example.com",
  "link": "https://example.com",
  "filter": "web",
  "tags": ["React", "TypeScript", "Node.js"]
}
```

**Поля:**
- `title` (string, обязательное) - Название проекта
- `image` (string, опциональное) - URL изображения
- `imageBig` (string, опциональное) - URL большого изображения
- `github` (string, опциональное) - Ссылка на GitHub репозиторий
- `linkOnDeploy` (string, опциональное) - Ссылка на деплой
- `link` (string, опциональное) - Дополнительная ссылка
- `filter` (string, обязательное) - Категория/фильтр проекта
- `tags` (string[], опциональное) - Массив тегов (создаются автоматически, если не существуют)

**Ответ (200 OK):**
```json
{
  "id": 1,
  "title": "Новый проект",
  "image": "https://example.com/image.jpg",
  "imageBig": "https://example.com/image-big.jpg",
  "github": "https://github.com/user/repo",
  "linkOnDeploy": "https://deploy.example.com",
  "link": "https://example.com",
  "filter": "web",
  "tags": [
    {
      "id": 1,
      "name": "React"
    },
    {
      "id": 2,
      "name": "TypeScript"
    }
  ]
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден

---

### PUT `/projects/:id`
Обновить проект

**Требуется авторизация:** ✅

**Параметры:**
- `id` (number) - ID проекта

**Тело запроса:**
```json
{
  "title": "Обновленное название",
  "filter": "mobile",
  "tags": ["React Native", "TypeScript"]
}
```

**Все поля опциональные.** Можно обновить только нужные поля.

**Ответ (200 OK):**
```json
{
  "id": 1,
  "title": "Обновленное название",
  "image": "https://example.com/image.jpg",
  "imageBig": "https://example.com/image-big.jpg",
  "github": "https://github.com/user/repo",
  "linkOnDeploy": "https://deploy.example.com",
  "link": "https://example.com",
  "filter": "mobile",
  "tags": [
    {
      "id": 3,
      "name": "React Native"
    },
    {
      "id": 2,
      "name": "TypeScript"
    }
  ]
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `404 Not Found` - Проект не найден

---

### DELETE `/projects/:id`
Удалить проект

**Требуется авторизация:** ✅

**Параметры:**
- `id` (number) - ID проекта

**Ответ (200 OK):**
```json
{
  "success": true
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `404 Not Found` - Проект не найден

---

## 4. Комментарии (Comments)

### GET `/comments`
Получить список всех комментариев

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "comment": "Отличный проект!",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "userId": 1,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "Иван",
      "surname": "Иванов",
      "isGuest": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "Reaction": [
      {
        "id": 1,
        "type": "like",
        "userId": 2,
        "commentId": 1
      }
    ]
  }
]
```

---

### GET `/comments/:id`
Получить комментарий по ID

**Параметры:**
- `id` (number) - ID комментария

**Ответ (200 OK):**
```json
{
  "id": 1,
  "comment": "Отличный проект!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "userId": 1,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван",
    "surname": "Иванов",
    "isGuest": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "Reaction": [
    {
      "id": 1,
      "type": "like",
      "userId": 2,
      "commentId": 1
    }
  ]
}
```

**Ошибки:**
- `404 Not Found` - Комментарий не найден

---

### POST `/comments`
Создать новый комментарий

**Требуется авторизация:** ✅

**Тело запроса:**
```json
{
  "comment": "Отличный проект!"
}
```

**Поля:**
- `comment` (string, обязательное) - Текст комментария

**Ответ (200 OK):**
```json
{
  "id": 1,
  "comment": "Отличный проект!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "userId": 1
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден

---

### PUT `/comments/:id`
Обновить комментарий

**Требуется авторизация:** ✅  
**Ограничение:** Можно обновить только свой комментарий

**Параметры:**
- `id` (number) - ID комментария

**Тело запроса:**
```json
{
  "comment": "Обновленный текст комментария"
}
```

**Поля:**
- `comment` (string, опциональное) - Новый текст комментария

**Ответ (200 OK):**
```json
{
  "id": 1,
  "comment": "Обновленный текст комментария",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "userId": 1
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `403 Forbidden` - Попытка обновить чужой комментарий
- `404 Not Found` - Комментарий не найден

---

### DELETE `/comments/:id`
Удалить комментарий

**Требуется авторизация:** ✅  
**Ограничение:** Можно удалить только свой комментарий

**Параметры:**
- `id` (number) - ID комментария

**Ответ (200 OK):**
```json
{
  "success": true
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `403 Forbidden` - Попытка удалить чужой комментарий
- `404 Not Found` - Комментарий не найден

---

## 5. Реакции (Reactions)

### GET `/reactions`
Получить список всех реакций

**Query параметры:**
- `commentId` (number, опциональное) - Фильтр по ID комментария

**Примеры:**
- `GET /reactions` - Получить все реакции
- `GET /reactions?commentId=1` - Получить реакции для комментария с ID=1

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "type": "like",
    "userId": 1,
    "commentId": 1
  },
  {
    "id": 2,
    "type": "dislike",
    "userId": 2,
    "commentId": 1
  }
]
```

---

### POST `/reactions`
Создать новую реакцию

**Требуется авторизация:** ✅

**Тело запроса:**
```json
{
  "type": "like",
  "commentId": 1
}
```

**Поля:**
- `type` (string, обязательное) - Тип реакции (например: "like", "dislike", "heart")
- `commentId` (number, опциональное) - ID комментария, к которому относится реакция

**Ответ (200 OK):**
```json
{
  "id": 1,
  "type": "like",
  "userId": 1,
  "commentId": 1
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден

---

### PUT `/reactions/:id`
Обновить реакцию

**Требуется авторизация:** ✅  
**Ограничение:** Можно обновить только свою реакцию

**Параметры:**
- `id` (number) - ID реакции

**Тело запроса:**
```json
{
  "type": "dislike"
}
```

**Поля:**
- `type` (string, опциональное) - Новый тип реакции

**Ответ (200 OK):**
```json
{
  "id": 1,
  "type": "dislike",
  "userId": 1,
  "commentId": 1
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `403 Forbidden` - Попытка обновить чужую реакцию
- `404 Not Found` - Реакция не найдена

---

### DELETE `/reactions/:id`
Удалить реакцию

**Требуется авторизация:** ✅  
**Ограничение:** Можно удалить только свою реакцию

**Параметры:**
- `id` (number) - ID реакции

**Ответ (200 OK):**
```json
{
  "success": true
}
```

**Ошибки:**
- `401 Unauthorized` - Токен отсутствует или невалиден
- `403 Forbidden` - Попытка удалить чужую реакцию
- `404 Not Found` - Реакция не найдена

---

## 6. Тестовые эндпоинты

### GET `/api/test`
Тестовый эндпоинт для проверки CORS

**Ответ (200 OK):**
```json
{
  "message": "CORS работает!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### GET `/`
Главная страница

**Ответ (200 OK):**
```
Hello World!
```

---

## Коды ошибок

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс успешно создан
- `400 Bad Request` - Неверный формат запроса
- `401 Unauthorized` - Требуется авторизация или невалидный токен
- `403 Forbidden` - Доступ запрещен (попытка изменить/удалить чужой ресурс)
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

---

## Примеры использования

### Получение токена и работа с защищенными эндпоинтами

```javascript
// 1. Регистрация
const registerResponse = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'Иван',
    surname: 'Иванов'
  })
});
const { access_token } = await registerResponse.json();

// 2. Использование токена для создания проекта
const projectResponse = await fetch('http://localhost:3000/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    title: 'Мой проект',
    filter: 'web',
    tags: ['React', 'TypeScript']
  })
});
const project = await projectResponse.json();

// 3. Создание комментария
const commentResponse = await fetch('http://localhost:3000/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    comment: 'Отличный проект!'
  })
});
const comment = await commentResponse.json();
```

---

## Примечания

1. **JWT токены** истекают через 1 час (настраивается в `auth.module.ts`)
2. **Пароли** автоматически хешируются при регистрации через `/auth/register`
3. **Теги проектов** создаются автоматически, если не существуют
4. **Владельцы ресурсов** могут изменять/удалять только свои ресурсы (комментарии, реакции, профиль)
5. **Пароли** никогда не возвращаются в ответах API
6. **CORS** настроен для работы с фронтендом (по умолчанию `http://localhost:5173`)

