# Social Hamster - My Pet Project

Social Hamster - мой первый пет проект.<br>
Целью была попытка реализовать функционал социальной сети.<br>
Backend и Frontend написаны мною с нуля. Весь код в проекте написан собственноручно.<br>
**Я не Fronend разработчик и уж тем более не дизайнер, поэтому я не изучал лучших практик в построении Frontend приложений, тем не менее я старался написать качественный код**

Рабочий сайт проекта: https://socialhasmter.homka122.ru <br>
Рабочее URL backend проекта: https://apisocialhasmter.homka122.ru

BACKEND: https://github.com/homka122/socialHamster <br>
FRONTEND: https://github.com/homka122/socialHamsterFrontend

## Возможности сайта

- Регистрация, авторизация, роли.
- Диалоги, сообщения и получение таковых в реальном времени (веб-сокеты).
- Лента постов, возможность лайкать посты.
- Комментарии к постам, возможность лайкать комментарии.
- Личная страница пользователя.
- Возможность сменить фото профиля.
- Возможность добавить пользователя в друзья\отклонить заявку\оставить в подписчиках.

## Технологии, которые я использовал при написании бекенда

- Сервер: nginx (reverse-proxy, настройка статики)
- База данных: MongoDB (mongoose). В том числе технология aggregation. <br>
- Веб-Сокеты: ws. <br>
- Работа с файлами: multer. <br>
- Работа с JWT-токенами: jsonwebtoken. <br>
- Валидация данных: JOI. <br>
- Хеширование паролей: bcryptjs. <br>
- Работа с CORS: cors.

## Технологии, которые я использовал при написании фронтенда

- Фреймворк: React.
- Роутинг: React-router-dom.
- Веб-сокеты: ws.

## Запуск backend

Файл .env должен содержать поля "DB_URL","PORT","JWT_ACCESS_SECRET","JWT_REFRESH_SECRET" \
DB_URL - ссылка к базе данных по протоколу mongodb \
PORT - любой незанятый порт \
JWT_ACCESS_SECRET \* JWT_REFRESH_SECRET - секретная строка для JWT \

npm start - запуск проекта.
