##### mesto_server_with_db
##### https://github.com/alsu-dxdy/mesto_server_with_db
 Version v0.0.2
 Description: Creating server with db, without authentication
 Для вадидации ссылок используется сторонний валидатор:
##### https://github.com/validatorjs/validator.js
##### Инструкция по сборке:
1. Запустить в разных терминалах сервер MongoDB:
<li> mongod --dbpath  ../data/db
<li> mongo
2. Запустить сервер на localhost:3000 с хот релоудом командой:
<li> npm run dev

Точка входа: app.js 
 
Node.js приложение подключается к серверу Mongo по адресу mongodb://localhost:27017/mestodb;
<li> созданы схема и модель пользователя с полями name, about и avatar, поля корректно валидируются;
<li> созданы схема и модель карточки с полями name, link, owner, likes и createdAt, поля корректно валидируются;
##### Роуты для юзеров:
<li> GET /users — возвращает всех пользователей
<li> GET /users/:userId - возвращает пользователя по _id
<li> POST /users — создаёт пользователя
<li> DELETE /users/:userId — удаляет юзера по идентификатору
##### Роуты для карточек:
<li> GET /cards — возвращает все карточки
<li> GET /cards/:cardId - возвращает карточку по _id
<li> POST /cards — создаёт карточку
<li> DELETE /cards/:cardId — удаляет карточку по идентификатору

Если в любом из запросов что-то идёт не так, сервер возвращает ответ с ошибкой и соответствующим ей статусом;
##### Также реализованы роуты:
<li> PATCH /users/me — обновляет профиль
<li> PATCH /users/me/avatar — обновляет аватар
<li> PUT /cards/:cardId/likes — поставить лайк карточке
<li> DELETE /cards/:cardId/likes — убрать лайк с карточки


 