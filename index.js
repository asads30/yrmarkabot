const { Telegraf } = require('telegraf');
const { Markup } = Telegraf
const session = require('telegraf/session')
const data = require('./data')
const texts = require('./texts')
const mysql = require('mysql')
const axios = require('axios')
const express = require("express")
const app = express()
const cors = require('cors')
app.use('/static', express.static('photo'))
app.use(cors({
    origin: '*'
}))
const bot = new Telegraf(data.token)
var https = require('https'),     
    http = require('http'), 
    Stream = require('stream').Transform,                                  
    fs = require('fs')
var con = mysql.createConnection({
    host: "localhost",
    database: "telegram",
    user: "root",
    password: "root",
    charset: "utf8mb4_general_ci"
})
con.connect(function(err) {
    if (err) throw err;
})
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
const text2 = `☀️ Чтобы я смог сделать твой канал еще круче, тебе нужно выполнить несколько простых действий:

1) Добавь @Yrmarkabot в администраторы своего канала
2) Перешли мне адрес (username или ссылку) своего канала`
const text4 = `✅Я все опубликовал: пост на канале с описанием товара и стоимостью только что вышел. 

Осталось только дождаться покупателей

/add_product - Создать еще товар
/my_channels - Изменить канал
/my_orders - Мои заказы
/payment - Вывод средств`
bot.use(session())
bot.start((ctx) => {
    const user_id = ctx.from.id
    const first_name = ctx.from.first_name
    const last_name = ctx.from.last_name
    const username = ctx.from.username

    // ТЕКСТА
    const text1 = `😊 Привет, ${first_name}! Разреши представиться: я – полезный бот для админа. На меня уже подписано более 1 000 пользователей. И я рад видеть тебя среди них. 😉 Я умею:
    
📍 Создавать товары в твоем телеграм канале
📍 Принимать оплату прямо в Телеграм, если ты продаешь свои товары и услуги
    
Надеюсь, тебе интересно? Тогда добавляй свой канал, чтобы я смог стать и твоим помощником 🚀🚀🚀
    
/add_channel - добавить канал`

    con.query(`UPDATE users SET step = '0' WHERE user_id = ${user_id}`)

    con.query(`SELECT * FROM users WHERE user_id=${user_id}`, function (err, result, fields) {

        const current_user = result[0]

        con.query(`SELECT address FROM channels WHERE author = ${user_id}`, function (err, result, fields) {

            const current_user_channels = result;

            if(current_user?.id === undefined){
                con.query(`INSERT INTO users (user_id, first_name, last_name, username, role, balance, step) VALUES (?, ?, ?, ?, ?, ?, ?)`, [user_id, first_name, last_name, username, 'author', 0, 0])
                ctx.replyWithPhoto(`https://wpaka.uz/photo/01.jpg`, {
                    caption: text1,
                    reply_markup: {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "Добавить канал",
                                    "callback_data": "add_channel"            
                                }
                            ]
                        ],
                        remove_keyboard: true
                    }
                })
            } else if(current_user_channels === undefined){
                ctx.replyWithPhoto('https://wpaka.uz/photo/01.jpg', {
                    caption: text1,
                    reply_markup: {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "Добавить канал",
                                    "callback_data": "add_channel"
                                }
                            ]
                        ],
                        remove_keyboard: true
                    }
                })
            } else {
                ctx.replyWithPhoto('https://wpaka.uz/photo/02.jpg', {
                    caption: texts.txt1,
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            }
        })
    })
})

bot.on('text', async (ctx, next) => {

    const user_id = ctx.from.id
    const current_text = ctx.message.text
    const first_name = ctx.from.first_name
    const last_name = ctx.from.last_name
    const username = ctx.from.username

    // ТЕКСТА
    const text1 = `😊 Привет, ${first_name}! Разреши представиться: я – полезный бот для админа. На меня уже подписано более 1 000 пользователей. И я рад видеть тебя среди них. 😉 Я умею:
        
📍 Создавать товары в твоем телеграм канале
📍 Принимать оплату прямо в Телеграм, если ты продаешь свои товары и услуги
    
Надеюсь, тебе интересно? Тогда добавляй свой канал, чтобы я смог стать и твоим помощником 🚀🚀🚀
    
/add_channel - добавить канал`
    const text3 = `👉🏻 Посмотрим, что получилось? 
    
Нажми на кнопку "Предпросмотр" чтобы увидеть, как сообщение будет выглядеть в канале.
            
Если не хочешь тратить время - выбирай публикацию и на твоем канале будет опубликован товар 👌🏻`

    con.query(`SELECT * FROM users WHERE user_id=${user_id}`, function (err, result, fields) {

        const current_user = result[0]

        con.query(`SELECT address FROM channels WHERE author = ${user_id}`, function (err, result, fields) {

            const current_user_channels = result;

            if(current_user?.id === undefined){
                con.query(`INSERT INTO users (user_id, first_name, last_name, username, role, balance, step) VALUES (?, ?, ?, ?, ?, ?, ?)`, [user_id, first_name, last_name, username, 'author', 0, 0])
                ctx.replyWithPhoto('https://wpaka.uz/photo/01.jpg', {
                    caption: text1,
                    reply_markup: {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "Добавить канал",
                                    "callback_data": "add_channel"            
                                }
                            ]
                        ],
                        remove_keyboard: true
                    }
                })
            } else if(current_user.step != 1 && current_user_channels === undefined){
                ctx.replyWithPhoto('https://wpaka.uz/photo/01.jpg', {
                    caption: text1,
                    reply_markup: {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "Добавить канал",
                                    "callback_data": "add_channel"            
                                }
                            ]
                        ],
                        remove_keyboard: true
                    }
                })
            } else if(current_text == '/add_product'){
                ctx.replyWithPhoto('https://wpaka.uz/photo/04.jpg', {
                    caption: '👌🏻 Давай разнообразим ассортимент твоих товаров!',
                    reply_markup: {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "Начать",
                                    "callback_data": "add_product"            
                                }
                            ]
                        ],
                        remove_keyboard: true
                    }
                })
            } else if(current_text == '/payment'){
                ctx.reply(`Ваш баланс: ${current_user.balance}`, {
                    reply_markup: {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "Заказать выплату",
                                    "callback_data": "go_payment"
                                }
                            ]
                        ],
                        remove_keyboard: true
                    }
                })
            } else if(current_text == '/my_orders'){
                con.query(`SELECT * FROM payments WHERE user_id = ${user_id}`, function (err, result, fields) {
                    if(result[0]){
                        result.forEach(element => {
                            ctx.reply(`Платеж №${element.id}, ID поста: ${element.post_id}, Цена: ${element.amount/100}`, {
                                reply_markup: {
                                    hide_keyboard: true
                                }
                            })
                            
                        });
                    } else {
                        ctx.reply('Заказов нет', {
                            reply_markup: {
                                hide_keyboard: true
                            }
                        })
                    }
                })
            } else if(current_text == '/my_channels'){
                let channels = [];
                current_user_channels.forEach(element => {
                    channels.push(element.address)
                });
                let my_channels = channels.join(`
`);
                let text = `☀️ Список ваших подключенных каналов:

${my_channels}`;
                ctx.replyWithMarkdown(text, {
                    reply_markup: {
                        "inline_keyboard": [
                            [
                                {
                                    "text": "Добавить еще",
                                    "callback_data": "add_channel"
                                }
                            ]
                        ],
                        remove_keyboard: true
                    }
                })
            } else if(current_text == '/add_channel'){
                con.query(`UPDATE users SET step = 1 WHERE user_id = ${user_id}`)
                ctx.replyWithMarkdown(text2, {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            } else if(current_user.step == 1){
                let text = ctx.message.text,
                channel
    
                if(text){
                    if ( text.includes('https://t.me/') ) {
                        channel = text.split('https://t.me/').join('@')
                    } else if( text.includes('http://t.me/') ){
                        channel = text.split('http://t.me/').join('@')
                    } else {
                        channel = text
                    }
                    ctx.telegram.getChatAdministrators(channel).then(res => {
                        let isAdmin = false
                        res.forEach(admins => {
                            if(admins.user.id == user_id){
                                isAdmin = true
                            }
                        })
                        if(isAdmin === true){
                            con.query(`INSERT INTO channels (address, author) VALUES (?, ?)`, [channel, user_id])

                            con.query(`UPDATE users SET step = '0' WHERE user_id = ${user_id}`)

                            axios.get(`https://api.telegram.org/bot${data.token}/getUpdates`).then()

                            ctx.replyWithPhoto('https://wpaka.uz/photo/02.jpg', {
                                caption: texts.txt1,
                                reply_markup: {
                                    remove_keyboard: true
                                }
                            })
                        } else {
                            ctx.reply('😕 Извини, но я почему–то не вижу тебя среди админов этого канала. Отправь нам канал где ты являешся администратором или создателем', {
                                reply_markup: {
                                    remove_keyboard: true
                                }
                            })
                        }
                    }).catch(e => {
                        ctx.reply('😕 Ошибка: Ты точно добавил наш бот в администраторы канала? Либо ты неправильно нам присылаешь нам адрес канала', {
                            reply_markup: {
                                remove_keyboard: true
                            }
                        })
                    })
                }
            } else if(current_user.step == 2){
                let text = ctx.message.text;
                con.query(`UPDATE posts SET title = ? WHERE id = ${ctx.session.post_id}`, [text]);
                con.query(`UPDATE users SET step = '2-2' WHERE user_id = ${user_id}`);
                ctx.replyWithPhoto('https://wpaka.uz/photo/06.jpg', {
                    caption: 'Мне тоже нужна такая штука! 😉 А теперь расскажи о своем товаре подробней. Отправь мне описание, которое смогут прочитать клиенты. 😊 Не забудь: описание должно быть не более 255 символов',
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            } else if(current_user.step == '2-2'){
                let text = ctx.message.text;
                con.query(`UPDATE posts SET des = ? WHERE id = ${ctx.session.post_id}`, [text]);
                con.query(`UPDATE users SET step = '2-3' WHERE user_id = ${user_id}`);
                ctx.replyWithPhoto('https://wpaka.uz/photo/07.jpg', {
                    caption: '👍🏻 Отлично! Может быть, добавим фото товара? Загрузи сюда одну самую лучшую фотографию!',
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            } else if(current_user.step == '2-4'){
                let text = ctx.message.text;
                let check = isNumeric(text);
                if(check === true){
                    ctx.replyWithPhoto('https://wpaka.uz/photo/09.jpg', {
                        caption: text3, reply_markup: {
                            "inline_keyboard": [
                                [
                                    {
                                        "text": "Предпросмотр",
                                        "callback_data": "preview_product"            
                                    }
                                ],
                                [
                                    {
                                        "text": "Опубликовать",
                                        "callback_data": "push_product"            
                                    }
                                ]
                            ],
                            remove_keyboard: true
                        }
                    })
                    con.query(`UPDATE posts SET price = ? WHERE id = ${ctx.session.post_id}`, [text]);
                    con.query(`UPDATE users SET step = '0' WHERE user_id = ${user_id}`);
                } else {
                    ctx.reply('Неправильный формат цены (введите только цифры)')
                }
            } else if(current_user.step == '5'){
                let text = ctx.message.text;
                con.query(`UPDATE users SET step = '0' WHERE user_id = ${user_id}`);
                con.query(`UPDATE posts SET channel = ?, status = ? WHERE id = ${ctx.session.post_id}`, [text, 1]);
                con.query(`SELECT * FROM posts WHERE id=${ctx.session.post_id}`, function (err, result, fields) {
                    let post = result[0];
                    const invoice = {
                        chat_id: text,
                        provider_token: data.payment,
                        start_parameter: 'get_access',
                        title: post?.title,
                        description: post?.des,
                        currency: 'RUB',
                        prices: [{ label: post?.title, amount: 100 * post?.price }],
                        photo_url: `https://wpaka.site/bot/01/photo/${post?.image}.jpg`,
                        photo_width: '800',
                        photo_height: '480',
                        need_name: true,
                        need_phone_number: true,
                        need_shipping_address: true,
                        payload: ctx.session.post_id
                    }
                    try {
                        ctx.replyWithInvoice(invoice);
                    } catch (error) {
                    }
                    ctx.reply(text4, {
                        reply_markup: {
                            remove_keyboard: true
                        }
                    })
                });
            }
        })
    });
});

bot.on('photo', async (ctx, next) => {
    const user_id = ctx.message.from.id;
    con.query(`SELECT * FROM users WHERE user_id=${user_id}`, function (err, result, fields) {
        const current_user = result[0]
        if(current_user.step == '2-3'){
            let file_id = ctx.message.photo[2]?.file_id;
            let fileid = ctx.message.photo[2]?.file_unique_id;
            axios.get(`https://api.telegram.org/bot${data.token}/getFile?file_id=${file_id}`).then(res => {
                let file_url = `https://api.telegram.org/file/bot${data.token}/${res.data.result.file_path}`;
                con.query(`UPDATE posts SET image = ? WHERE id = ${ctx.session.post_id}`, [fileid]);
                https.request(file_url, function(response) {                                        
                    var data = new Stream();
                        response.on('data', function(chunk) {                                       
                        data.push(chunk);                                                         
                    });
                    response.on('end', function() {                                             
                        fs.writeFileSync(`./photo/${fileid}.jpg`, data.read(), 'utf-8');
                    });
                }).end();
                con.query(`UPDATE users SET step = '2-4' WHERE user_id = ${user_id}`);
                ctx.replyWithPhoto('https://wpaka.site/photo/07.jpg', {
                    caption: 'А теперь давай расскажем им, сколько это стоит. 👌🏻 Не забудь, что оплата принимается в рублях 😉',
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            });
        }
    })
});

bot.on('document', async (ctx, next) => {
    const user_id = ctx.message.from.id;
    con.query(`SELECT * FROM users WHERE user_id=${user_id}`, function (err, result, fields) {
        const current_user = result[0]
        if(current_user.step == '2-3'){
            let file_id = ctx.message.document[2]?.file_id;
            let fileid = ctx.message.document[2]?.file_unique_id;
            axios.get(`https://api.telegram.org/bot${data.token}/getFile?file_id=${file_id}`).then(res => {
                let file_url = `https://api.telegram.org/file/bot${data.token}/${res.data.result.file_path}`;
                con.query(`UPDATE posts SET image = ? WHERE id = ${ctx.session.post_id}`, [fileid]);
                https.request(file_url, function(response) {                                        
                    var data = new Stream();
                        response.on('data', function(chunk) {                                       
                        data.push(chunk);                                                         
                    });
                    response.on('end', function() {                                             
                        fs.writeFileSync(`./photo/${fileid}.jpg`, data.read(), 'utf-8');
                    });
                }).end();
                con.query(`UPDATE users SET step = '2-4' WHERE user_id = ${user_id}`);
                ctx.replyWithPhoto('https://wpaka.uz/photo/07.jpg', {
                    caption: 'А теперь давай расскажем им, сколько это стоит. 👌🏻 Не забудь, что оплата принимается в рублях 😉',
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            });
        }
    })
});

bot.on('callback_query', (ctx, next) => {
    const user_id = ctx.callbackQuery.from.id;
    con.query(`SELECT * FROM users WHERE user_id=${user_id}`, function (err, result, fields) {
        const current_user = result[0];
        if(ctx.callbackQuery.data == 'add_product'){
            con.query(`INSERT INTO posts (user_id) VALUES (?)`, [user_id], function(err, result, fields) {
                if(!err){
                    con.query(`UPDATE users SET step = 2 WHERE user_id = ${user_id}`);
                    ctx.session.post_id = result.insertId
                }
            });
            try {
                ctx.deleteMessage();
            } catch (error) {
                ctx.reply(error, {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            }
            ctx.replyWithPhoto('https://wpaka.uz/photo/05.jpg', {
                caption: 'Отправь мне название товара, который хочешь добавить',
                reply_markup: {
                    remove_keyboard: true
                }
            })
        } else if(ctx.callbackQuery.data == 'preview_product'){
            try {
                ctx.deleteMessage();
            } catch (error) {
                ctx.reply(error, {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            }
            con.query(`UPDATE users SET step = 3 WHERE user_id = ${user_id}`);
            con.query(`UPDATE posts SET status = 0 WHERE id = ${ctx.session.post_id}`);
            con.query(`SELECT * FROM posts WHERE id = ${ctx.session.post_id}`, function (err, result, fields) {
                let post = result[0];
                const invoice = {
                    chat_id: ctx.callbackQuery.from.id,
                    provider_token: data.payment,
                    start_parameter: 'get_access',
                    title: post?.title,
                    description: post?.des,
                    currency: 'RUB',
                    prices: [{ label: post?.title, amount: 100 * post?.price }],
                    photo_url: `https://wpaka.site/bot/01/photo/${post?.image}.jpg`,
                    photo_width: '800',
                    photo_height: '480',
                    need_name: true,
                    need_phone_number: true,
                    need_shipping_address: true,
                    payload: ctx.session.post_id
                }
                try {
                    ctx.replyWithInvoice(invoice);
                } catch (error) {
                }
                setTimeout(() => {
                    ctx.reply('Опубликовать', {
                        reply_markup: {
                            "inline_keyboard": [
                                [
                                    {
                                        "text": "Да!",
                                        "callback_data": "push_product"            
                                    }
                                ]
                            ],
                            remove_keyboard: true
                        }
                    })
                }, 500);
            });
        } else if(ctx.callbackQuery.data == 'push_product'){
            try {
                ctx.deleteMessage();
            } catch (error) {
                ctx.reply(error, {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            }
            con.query(`UPDATE users SET step = 5 WHERE user_id = ${user_id}`);
            con.query(`SELECT address FROM channels WHERE author = ${user_id}`, function (err, result, fields) {
                var channels = [];
                result.forEach(element => {
                    channels.push(element.address)
                });
                ctx.reply('Выберите канал для публикации', {
                    reply_markup: Markup.keyboard(channels)
                })
            });
        } else if(ctx.callbackQuery.data == 'add_channel'){
            try {
                ctx.deleteMessage();
            } catch (error) {
                ctx.reply(error, {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            }
            con.query(`UPDATE users SET step = 1 WHERE user_id = ${user_id}`)
            ctx.replyWithMarkdown(text2, {
                reply_markup: {
                    remove_keyboard: true
                }
            })
        } else if(ctx.callbackQuery.data == 'go_payment'){
            if(current_user.balance < 1000){
                ctx.answerCbQuery('Минимальная сумма выплаты 1000 руб', true);
            } else {
                ctx.answerCbQuery('Выплата успешно заказа', true);
                ctx.telegram.sendMessage('-1001889076042', `Заявка на вывод от ${user_id}, сумма - ${current_user.balance}`);
                con.query(`UPDATE users SET balance = 0 WHERE user_id = ${user_id}`);
            }
        }
    })
})

bot.on('pre_checkout_query', async (ctx) => {
    const total = ctx.preCheckoutQuery.total_amount
    const user_id = ctx.preCheckoutQuery.from.id
    const post_id = ctx.preCheckoutQuery.invoice_payload
    const first_name = ctx.preCheckoutQuery.from?.first_name
    const last_name = ctx.preCheckoutQuery.from?.last_name
    const username = ctx.preCheckoutQuery.from?.username
    const phone_number = ctx.preCheckoutQuery.order_info?.phone_number
    con.query(`INSERT INTO payments (post_id, status, user_id, amount, first_name, last_name, username, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [post_id, 0, user_id, total, first_name, last_name, username, phone_number])
    await ctx.answerPreCheckoutQuery(true)
})
  
bot.on('successful_payment', async (ctx, next) => {
    const post_id = ctx.update.message.successful_payment.invoice_payload
    const amount = ctx.update.message.successful_payment.total_amount / 100;
    con.query(`UPDATE payments SET status = 1 WHERE post_id = ${post_id}`)
    con.query(`SELECT * FROM posts WHERE id=${post_id}`, function (err, result, fields) {
        const res = result[0];
        const amountPersent = amount*0.9;
        con.query(`UPDATE users SET balance=balance+${amountPersent} WHERE user_id = ${res.user_id}`);
        bot.telegram.sendMessage(res.user_id, `Поступил заказ от ${ctx.update.message.successful_payment.order_info.name}
Номер телефона: ${ctx.update.message.successful_payment.order_info.phone_number}

Доставка:
Страна: ${ctx.update.message.successful_payment.order_info.shipping_address.country_code}
Область: ${ctx.update.message.successful_payment.order_info.shipping_address.state}
Город: ${ctx.update.message.successful_payment.order_info.shipping_address.city}
Адрес 1: ${ctx.update.message.successful_payment.order_info.shipping_address.street_line1}
Адрес 2: ${ctx.update.message.successful_payment.order_info.shipping_address.street_line2}
Почтовый индекс: ${ctx.update.message.successful_payment.order_info.shipping_address.post_code}`)
    })
    await ctx.reply('Оплата прошла успешно', {
        reply_markup: {
            remove_keyboard: true
        }
    })
})

bot.launch()

app.get('/users', function (req, res) {
    con.query(`SELECT * FROM users`, function (err, result, fields) {
        res.send(result);
    })
});

app.get('/posts', function (req, res) {
    con.query(`SELECT * FROM posts`, function (err, result, fields) {
        res.send(result);
    })
});

app.get('/payments', function (req, res) {
    con.query(`SELECT * FROM payments`, function (err, result, fields) {
        res.send(result);
    })
});

app.get('/channels', function (req, res) {
    con.query(`SELECT * FROM channels`, function (err, result, fields) {
        res.send(result);
    })
});

var httpServer = http.createServer(app);
httpServer.listen(3000);