# **Сайт - коллекция книг**
### Поиск книг, краткая информация по каждой книге, комментарии
<p>&nbsp;</p>

# **Стек технологий**
### JavaScript, Fetch, Node.js, Handlebars, Express, Socket.IO, JWT, express-session, Bcrypt, PostgreSQL, Sequelize ORM.
<p>&nbsp;</p>

# **Функционал**
### На сайте можно зарегистрироваться.
![](https://i.imgur.com/U6dSfqv.png)
### Можно войти в свой аккаунт.
![](https://i.imgur.com/lJJWyg4.png)
### Осуществлен поиск по книгам.
![](book_search.gif)
### Перейдя в details видна краткая информация
![](https://i.imgur.com/dR0iAxw.png)
### Можно оставить комментарий к понравившейся книге
![](comments.gif)

# **Как запустить сайт**
### Для работы сайта необходим Node.js и PostgreSQL.
### В проекте должен быть файл .env с содержанием на основе шаблона:
```
DATABASE_URL=postgres://user:password@hostname:port/dbname
PORT=3000
```
+ `npm i`
+ `npx sequelize init`
+ `npx sequelize db:create`
+ `npx sequelize db:migrate`
+ для запуска `npm run dev`
