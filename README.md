# Social Hamster - My Pet Project

Social Hamster - мой первый пет проект.<br>
Целью была попытка реализовать функционал социальной сети.<br>
Backend и Frontend написаны мною с нуля. Весь код в проекте написан собственноручно.<br>
**Я не Fronend разработчик и уж тем более не дизайнер, поэтому я не изучал лучших практик в построении Frontend приложений, тем не менее я старался написать качественный код** \
**Дизайн для мобильных устройств не предусмотрен. Для корректного отображения сайта следует заходить с ПК**

Рабочий сайт проекта: https://socialhasmter.homka122.ru <br>
Рабочее URL backend проекта: https://apisocialhasmter.homka122.ru

Backend: https://github.com/homka122/socialHamster <br>
Frontend: https://github.com/homka122/socialHamsterFrontend

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
- Контейнеризация: Docker
- Фреймворк: Express
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

## Пример запуска backend с помощью Docker

Сервис mongod должен быть запущен на локальной машине \
Если база данных находиться на сервере - просто замените ссылку на ссылку для удаленного доступа

### Открыть доступ к Mongod для Docker

sudo vim /etc/mongod.conf (или любой другой редактор) \
 bindIp 127.0.0.1 -> bindIp: 127.0.0.1,172.17.0.1

Сохраняем - sudo service mongod restart

### Настройка .env:

DB_URL=mongodb://mongoservice:27017/socialHamsterTest \
PORT=5000 \
JWT_ACCESS_SECRET=dskfj2093jkfdsj0394j1fj3hj3 \
JWT_REFRESH_SECRET=jh4g6j2hgu234hv6h2uehv23h4g \
NODE_ENV=development

### Запуск контейнера:

sudo docker build -t social_hamster_back .

Запуск в консоли: \
sudo docker run -it --add-host=mongoservice:172.17.0.1 -p 5000:5000 social_hamster_back \
Запуск в фоне: \
sudo docker run -d --add-host=mongoservice:172.17.0.1 -p 5000:5000 social_hamster_back
