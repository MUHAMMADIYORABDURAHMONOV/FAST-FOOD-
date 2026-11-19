'use strict';

/* =========================================================
   FAST FOOD - script.js
   NOTE: Demo auth only. Passwords are NEVER stored.
   For real login/payments use a backend (see README notes).
   ========================================================= */

/* ---------- Storage helper ---------- */
const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
};

const DELIVERY_FEE = 12000;
const FREE_FROM = 150000;
const LANGS = ['uz', 'en', 'ru'];
const LOCALES = { uz: 'uz-UZ', en: 'en-GB', ru: 'ru-RU' };

/* ---------- Translations: key: [uz, en, ru] ---------- */
const T = {
    nav_home: ['Bosh sahifa', 'Home', 'Главная'],
    nav_menu: ['Menyu', 'Menu', 'Меню'],
    nav_about: ['Biz haqimizda', 'About', 'О нас'],
    nav_contact: ['Aloqa', 'Contact', 'Контакты'],
    nav_login: ['Kirish / Ro‘yxatdan o‘tish', 'Login / Register', 'Вход / Регистрация'],
    hero_badge: ['🔥 30 daqiqada yetkazib berish', '🔥 Delivery in 30 minutes', '🔥 Доставка за 30 минут'],
    hero_title: ['Tez. Mazali. Issiq.', 'Fast. Tasty. Hot.', 'Быстро. Вкусно. Горячо.'],
    hero_text: ['Burger, pitsa, lavash va yana ko‘plab mazali taomlar — to‘g‘ri eshigingizgacha.', 'Burgers, pizza, lavash and much more delicious food — right to your door.', 'Бургеры, пицца, лаваш и многое другое — прямо к вашей двери.'],
    hero_btn1: ['Buyurtma berish', 'Order now', 'Заказать'],
    hero_btn2: ['Maxsus takliflar', 'Special offers', 'Спецпредложения'],
    stat1: ['Mahsulot', 'Products', 'Блюд'],
    stat2: ['Mijozlar', 'Customers', 'Клиентов'],
    stat3: ['Reyting', 'Rating', 'Рейтинг'],
    popular_title: ['Ommabop mahsulotlar', 'Popular products', 'Популярные блюда'],
    popular_sub: ['Mijozlarimiz eng ko‘p tanlaydigan taomlar', 'Our customers’ favorites', 'Любимые блюда наших клиентов'],
    menu_title: ['Menyu', 'Menu', 'Меню'],
    menu_sub: ['O‘zingizga yoqqan taomni tanlang', 'Choose your favorite meal', 'Выберите своё любимое блюдо'],
    search_ph: ['Mahsulot nomi bo‘yicha qidirish...', 'Search by product name...', 'Поиск по названию...'],
    sort_popular: ['Eng mashhur', 'Most popular', 'Самые популярные'],
    sort_new: ['Eng yangi', 'Newest', 'Новинки'],
    sort_price_asc: ['Narx: arzondan qimmatga', 'Price: low to high', 'Цена: по возрастанию'],
    sort_price_desc: ['Narx: qimmatdan arzonga', 'Price: high to low', 'Цена: по убыванию'],
    sort_rating: ['Yuqori reyting', 'Top rated', 'По рейтингу'],
    cat_all: ['Hammasi', 'All', 'Все'],
    cat_burgers: ['Burgerlar', 'Burgers', 'Бургеры'],
    cat_pizza: ['Pitsa', 'Pizza', 'Пицца'],
    cat_lavash: ['Lavash', 'Lavash', 'Лаваш'],
    cat_hotdogs: ['Hot-doglar', 'Hot Dogs', 'Хот-доги'],
    cat_sandwiches: ['Sendvichlar', 'Sandwiches', 'Сэндвичи'],
    cat_fries: ['Kartoshka fri', 'French Fries', 'Картофель фри'],
    cat_chicken: ['Tovuq', 'Chicken', 'Курица'],
    cat_nuggets: ['Naggetslar', 'Nuggets', 'Наггетсы'],
    cat_drinks: ['Ichimliklar', 'Drinks', 'Напитки'],
    cat_desserts: ['Desertlar', 'Desserts', 'Десерты'],
    found: ['ta mahsulot topildi', 'products found', 'блюд найдено'],
    no_results: ['Hech narsa topilmadi 😕', 'Nothing found 😕', 'Ничего не найдено 😕'],
    add_to_cart: ['Savatga', 'Add to Cart', 'В корзину'],
    new_tag: ['YANGI', 'NEW', 'НОВОЕ'],
    added: ['Savatga qo‘shildi', 'Added to cart', 'Добавлено в корзину'],
    fav_added: ['Sevimlilarga qo‘shildi', 'Added to favorites', 'Добавлено в избранное'],
    fav_removed: ['Sevimlilardan olib tashlandi', 'Removed from favorites', 'Удалено из избранного'],
    offers_title: ['Maxsus takliflar', 'Special offers', 'Специальные предложения'],
    offers_sub: ['Eng yaxshi chegirmalarni qo‘ldan boy bermang', 'Don’t miss our best deals', 'Не упустите лучшие предложения'],
    offer1_t: ['Burger haftaligi', 'Burger week', 'Неделя бургеров'],
    offer1_d: ['Eng mazali burgerlarni tatib ko‘ring', 'Try our juiciest burgers', 'Попробуйте наши сочные бургеры'],
    offer2_t: ['Pitsa party', 'Pizza party', 'Пицца-вечеринка'],
    offer2_d: ['Do‘stlar va oila uchun ideal', 'Perfect for friends and family', 'Идеально для друзей и семьи'],
    offer3_t: ['Shirin vaqt', 'Sweet time', 'Сладкое время'],
    offer3_d: ['Desertlar va sovuq ichimliklar', 'Desserts and cold drinks', 'Десерты и холодные напитки'],
    offer_btn: ['Ko‘rish', 'View', 'Смотреть'],
    free_note: ['150 000 so‘mdan ortiq buyurtmalarga yetkazib berish bepul!', 'Free delivery for orders over 150 000 so‘m!', 'Бесплатная доставка при заказе от 150 000 сум!'],
    about_title: ['Biz haqimizda', 'About us', 'О нас'],
    about_t1: ['FAST FOOD — 2018-yildan buyon Toshkent aholisiga mazali va tez tayyorlanadigan taomlarni taqdim etib kelayotgan restoran.', 'FAST FOOD has been serving delicious, freshly made meals to Tashkent since 2018.', 'FAST FOOD с 2018 года готовит для жителей Ташкента вкусные блюда из свежих продуктов.'],
    about_t2: ['Biz faqat yangi masalliqlardan foydalanamiz va har bir buyurtmani sevgi bilan tayyorlaymiz.', 'We use only fresh ingredients and prepare every order with care.', 'Мы используем только свежие ингредиенты и готовим каждый заказ с заботой.'],
    about_f1: ['Yangi masalliqlar', 'Fresh ingredients', 'Свежие ингредиенты'],
    about_f2: ['Tez yetkazib berish', 'Fast delivery', 'Быстрая доставка'],
    about_f3: ['Hamyonbop narxlar', 'Affordable prices', 'Доступные цены'],
    reviews_title: ['Mijozlar fikrlari', 'Customer reviews', 'Отзывы клиентов'],
    rev1: ['Burgerlar juda mazali, yetkazib berish ham tez! Har hafta buyurtma beraman.', 'The burgers are amazing and delivery is super fast! I order every week.', 'Бургеры очень вкусные, а доставка быстрая! Заказываю каждую неделю.'],
    rev2: ['Pitsa issiq va yangi keldi. Narxlar ham juda yaxshi. Tavsiya qilaman!', 'The pizza arrived hot and fresh. Great prices too. Highly recommended!', 'Пицца приехала горячей и свежей. Цены тоже отличные. Рекомендую!'],
    rev3: ['Lavash va kartoshka fri zo‘r. Xizmat ko‘rsatish yuqori darajada.', 'Lavash and fries are great. The service is top level.', 'Лаваш и картофель фри отличные. Сервис на высоте.'],
    faq_title: ['Ko‘p so‘raladigan savollar', 'Frequently asked questions', 'Частые вопросы'],
    faq_q1: ['Yetkazib berish qancha vaqt oladi?', 'How long does delivery take?', 'Сколько занимает доставка?'],
    faq_a1: ['O‘rtacha 30–45 daqiqa. Band vaqtlarda biroz ko‘proq bo‘lishi mumkin.', 'On average 30–45 minutes. It may take a little longer at peak times.', 'В среднем 30–45 минут. В часы пик может быть немного дольше.'],
    faq_q2: ['Yetkazib berish narxi qancha?', 'How much is delivery?', 'Сколько стоит доставка?'],
    faq_a2: ['Yetkazib berish 12 000 so‘m. 150 000 so‘mdan ortiq buyurtmalarda bepul.', 'Delivery costs 12 000 so‘m. It is free for orders over 150 000 so‘m.', 'Доставка стоит 12 000 сум. При заказе от 150 000 сум — бесплатно.'],
    faq_q3: ['Qanday to‘lash mumkin?', 'How can I pay?', 'Как можно оплатить?'],
    faq_a3: ['Hozircha naqd pul bilan, buyurtma yetkazilganda to‘lanadi.', 'Currently cash on delivery only.', 'Пока оплата наличными при получении.'],
    faq_q4: ['Buyurtmani bekor qilish mumkinmi?', 'Can I cancel my order?', 'Можно ли отменить заказ?'],
    faq_a4: ['Ha, tayyorlash boshlanmaguncha bizga qo‘ng‘iroq qiling.', 'Yes, call us before preparation starts.', 'Да, позвоните нам до начала приготовления.'],
    contact_title: ['Biz bilan bog‘laning', 'Contact us', 'Свяжитесь с нами'],
    contact_sub: ['Savolingiz bormi? Bizga yozing, tez orada javob beramiz.', 'Have a question? Write to us and we will reply soon.', 'Есть вопрос? Напишите нам, мы скоро ответим.'],
    address_v: ['Toshkent sh., Amir Temur ko‘chasi 10', 'Tashkent, Amir Temur street 10', 'Ташкент, ул. Амира Темура, 10'],
    c_hours_v: ['Har kuni 09:00 – 23:00', 'Daily 09:00 – 23:00', 'Ежедневно 09:00 – 23:00'],
    c_name: ['Ismingiz', 'Your name', 'Ваше имя'],
    c_msg: ['Xabar', 'Message', 'Сообщение'],
    c_send: ['Yuborish', 'Send', 'Отправить'],
    c_sent: ['Xabaringiz yuborildi. Rahmat!', 'Your message was sent. Thank you!', 'Сообщение отправлено. Спасибо!'],
    footer_text: ['Tez, mazali va issiq taomlar — har kuni.', 'Fast, tasty and hot meals — every day.', 'Быстрая, вкусная и горячая еда — каждый день.'],
    footer_links: ['Havolalar', 'Links', 'Ссылки'],
    footer_rights: ['Barcha huquqlar himoyalangan.', 'All rights reserved.', 'Все права защищены.'],
    cart_title: ['Savatcha', 'Cart', 'Корзина'],
    cart_empty: ['Savatchangiz bo‘sh', 'Your cart is empty', 'Ваша корзина пуста'],
    cart_subtotal: ['Mahsulotlar narxi', 'Subtotal', 'Сумма'],
    cart_delivery: ['Yetkazib berish', 'Delivery', 'Доставка'],
    cart_total: ['Jami', 'Total', 'Итого'],
    free: ['Bepul', 'Free', 'Бесплатно'],
    checkout: ['Buyurtma berish', 'Checkout', 'Оформить заказ'],
    fav_title: ['Sevimlilar', 'Favorites', 'Избранное'],
    fav_empty: ['Sevimlilar ro‘yxati bo‘sh', 'No favorites yet', 'Избранное пусто'],
    login: ['Kirish', 'Login', 'Войти'],
    register: ['Ro‘yxatdan o‘tish', 'Register', 'Регистрация'],
    first_name: ['Ism', 'First name', 'Имя'],
    last_name: ['Familiya', 'Last name', 'Фамилия'],
    email: ['Email', 'Email', 'Email'],
    phone: ['Telefon raqam', 'Phone number', 'Телефон'],
    password: ['Parol', 'Password', 'Пароль'],
    confirm_password: ['Parolni tasdiqlang', 'Confirm password', 'Подтвердите пароль'],
    email_or_phone: ['Email yoki telefon', 'Email or phone', 'Email или телефон'],
    demo_note: ['Demo rejim: parollar saqlanmaydi. Haqiqiy loyiha uchun backend kerak.', 'Demo mode: passwords are not stored. A real project needs a backend.', 'Демо-режим: пароли не сохраняются. Для реального проекта нужен backend.'],
    err_required: ['Majburiy maydon', 'Required field', 'Обязательное поле'],
    err_email: ['Email noto‘g‘ri', 'Invalid email', 'Неверный email'],
    err_phone: ['Telefon raqam noto‘g‘ri', 'Invalid phone number', 'Неверный номер телефона'],
    err_pass_len: ['Parol kamida 6 belgi bo‘lsin', 'Password must be at least 6 characters', 'Пароль должен быть не менее 6 символов'],
    err_pass_match: ['Parollar mos emas', 'Passwords do not match', 'Пароли не совпадают'],
    err_not_found: ['Bunday foydalanuvchi topilmadi. Avval ro‘yxatdan o‘ting.', 'User not found. Please register first.', 'Пользователь не найден. Сначала зарегистрируйтесь.'],
    err_exists: ['Bu email yoki telefon allaqachon ro‘yxatdan o‘tgan', 'This email or phone is already registered', 'Этот email или телефон уже зарегистрирован'],
    welcome: ['Xush kelibsiz', 'Welcome', 'Добро пожаловать'],
    logged_out: ['Siz tizimdan chiqdingiz', 'You have logged out', 'Вы вышли из системы'],
    logout: ['Chiqish', 'Logout', 'Выйти'],
    my_account: ['Mening profilim', 'My account', 'Мой профиль'],
    orders_title: ['Buyurtmalar tarixi', 'Order history', 'История заказов'],
    orders_empty: ['Hali buyurtmalar yo‘q', 'No orders yet', 'Заказов пока нет'],
    order_no: ['Buyurtma raqami', 'Order No', 'Номер заказа'],
    ck_title: ['Buyurtmani rasmiylashtirish', 'Checkout', 'Оформление заказа'],
    ck_address: ['Yetkazib berish manzili', 'Delivery address', 'Адрес доставки'],
    ck_note: ['Qo‘shimcha izoh', 'Additional note', 'Комментарий'],
    ck_items: ['Buyurtma mahsulotlari', 'Your order', 'Ваш заказ'],
    ck_pay: ['To‘lov: yetkazib berilganda naqd pul', 'Payment: cash on delivery', 'Оплата: наличными при получении'],
    ck_confirm: ['Buyurtmani tasdiqlash', 'Confirm order', 'Подтвердить заказ'],
    ck_empty: ['Savatcha bo‘sh. Avval mahsulot qo‘shing.', 'Cart is empty. Add products first.', 'Корзина пуста. Сначала добавьте блюда.'],
    success_title: ['Buyurtma qabul qilindi!', 'Order placed!', 'Заказ оформлен!'],
    success_text: ['Rahmat! Operatorimiz tez orada siz bilan bog‘lanadi.', 'Thank you! Our operator will contact you shortly.', 'Спасибо! Наш оператор скоро свяжется с вами.'],
    success_btn: ['Ajoyib', 'Great', 'Отлично'],
    currency: ['so‘m', 'so‘m', 'сум'],
    pcs: ['dona', 'pcs', 'шт.']
};

/* ---------- Products: 30 unique items ----------
   Optional: add  img:'images/name.jpg'  to any product to use a real photo.
*/
const PRODUCTS = [
    // Burgers
    {
        id: 1, c: 'burgers', p: 32000, r: 4.7, e: '🍔', pop: 95,
        n: ['Klassik burger', 'Classic Burger', 'Классический бургер'],
        d: ['Mol go‘shti kotleti, yangi salat, pomidor va maxsus sous.', 'Beef patty, fresh lettuce, tomato and special sauce.', 'Говяжья котлета, свежий салат, помидор и фирменный соус.']
    },
    {
        id: 2, c: 'burgers', p: 36000, r: 4.8, e: '🧀', pop: 98,
        n: ['Chizburger', 'Cheeseburger', 'Чизбургер'],
        d: ['Ikki qavat cheddar pishlog‘i va bargli salat bilan.', 'Double cheddar cheese with crisp lettuce.', 'Двойной сыр чеддер и хрустящий салат.']
    },
    {
        id: 3, c: 'burgers', p: 48000, r: 4.9, e: '🥩', pop: 90,
        n: ['Ikki qavatli mol burgeri', 'Double Beef Burger', 'Двойной beef-бургер'],
        d: ['Ikkita sersuv kotlet, bekon va BBQ sous.', 'Two juicy patties, bacon and BBQ sauce.', 'Две сочные котлеты, бекон и соус BBQ.']
    },
    // Pizza
    {
        id: 4, c: 'pizza', p: 65000, r: 4.6, e: '🍅', pop: 80,
        n: ['Margarita pitsa', 'Margherita Pizza', 'Пицца Маргарита'],
        d: ['Pomidor sousi, mozzarella va rayhon.', 'Tomato sauce, mozzarella and basil.', 'Томатный соус, моцарелла и базилик.']
    },
    {
        id: 5, c: 'pizza', p: 78000, r: 4.9, e: '🍕', pop: 97,
        n: ['Pepperoni pitsa', 'Pepperoni Pizza', 'Пицца Пепперони'],
        d: ['Achchiq pepperoni va ko‘p pishloq.', 'Spicy pepperoni with plenty of cheese.', 'Острая пепперони и много сыра.']
    },
    {
        id: 6, c: 'pizza', p: 82000, r: 4.7, e: '🫓', pop: 75,
        n: ['To‘rt pishloqli pitsa', 'Four Cheese Pizza', 'Пицца Четыре сыра'],
        d: ['Mozzarella, parmezan, gorgonzola va cheddar.', 'Mozzarella, parmesan, gorgonzola and cheddar.', 'Моцарелла, пармезан, горгонзола и чеддер.']
    },
    // Lavash
    {
        id: 7, c: 'lavash', p: 28000, r: 4.8, e: '🌯', pop: 94,
        n: ['Tovuqli lavash', 'Chicken Lavash', 'Лаваш с курицей'],
        d: ['Tovuq go‘shti, bodring, pomidor va sarimsoqli sous.', 'Chicken, cucumber, tomato and garlic sauce.', 'Курица, огурец, помидор и чесночный соус.']
    },
    {
        id: 8, c: 'lavash', p: 34000, r: 4.7, e: '🥙', pop: 85,
        n: ['Mol go‘shtli lavash', 'Beef Lavash', 'Лаваш с говядиной'],
        d: ['Mol go‘shti, yangi sabzavotlar va achchiq sous.', 'Beef, fresh vegetables and spicy sauce.', 'Говядина, свежие овощи и острый соус.']
    },
    {
        id: 9, c: 'lavash', p: 26000, r: 4.5, e: '🫔', pop: 70,
        n: ['Pishloqli lavash', 'Cheese Lavash', 'Сырный лаваш'],
        d: ['Erigan pishloq va ko‘katlar bilan.', 'Melted cheese with fresh herbs.', 'Расплавленный сыр и свежая зелень.']
    },
    // Hot dogs
    {
        id: 10, c: 'hotdogs', p: 18000, r: 4.4, e: '🌭', pop: 78,
        n: ['Klassik hot-dog', 'Classic Hot Dog', 'Классический хот-дог'],
        d: ['Sosiska, gorchitsa va ketchup.', 'Sausage with mustard and ketchup.', 'Сосиска с горчицей и кетчупом.']
    },
    {
        id: 11, c: 'hotdogs', p: 22000, r: 4.6, e: '🧅', pop: 72,
        n: ['Pishloqli hot-dog', 'Cheese Hot Dog', 'Хот-дог с сыром'],
        d: ['Pishloq sousi va qovurilgan piyoz.', 'Cheese sauce and crispy fried onion.', 'Сырный соус и хрустящий жареный лук.']
    },
    {
        id: 12, c: 'hotdogs', p: 24000, r: 4.5, e: '🌶️', pop: 68,
        n: ['Achchiq hot-dog', 'Spicy Hot Dog', 'Острый хот-дог'],
        d: ['Jalapeno va achchiq sous bilan.', 'With jalapeño and hot sauce.', 'С халапеньо и острым соусом.']
    },
    // Sandwiches
    {
        id: 13, c: 'sandwiches', p: 30000, r: 4.6, e: '🥪', pop: 74,
        n: ['Klab sendvich', 'Club Sandwich', 'Клаб-сэндвич'],
        d: ['Tovuq, bekon, tuxum va yangi sabzavotlar.', 'Chicken, bacon, egg and fresh vegetables.', 'Курица, бекон, яйцо и свежие овощи.']
    },
    {
        id: 14, c: 'sandwiches', p: 29000, r: 4.3, e: '🐟', pop: 55,
        n: ['Tunetsli sendvich', 'Tuna Sandwich', 'Сэндвич с тунцом'],
        d: ['Tunets, mayonez va bodring.', 'Tuna, mayo and cucumber.', 'Тунец, майонез и огурец.']
    },
    {
        id: 15, c: 'sandwiches', p: 25000, r: 4.4, e: '🥬', pop: 60,
        n: ['Vegetarian sendvich', 'Veggie Sandwich', 'Вегетарианский сэндвич'],
        d: ['Avokado, pomidor, salat va gummus.', 'Avocado, tomato, lettuce and hummus.', 'Авокадо, помидор, салат и хумус.']
    },
    // Fries
    {
        id: 16, c: 'fries', p: 14000, r: 4.5, e: '🍟', pop: 92,
        n: ['Klassik kartoshka fri', 'Classic Fries', 'Классический фри'],
        d: ['Tillarang va qarsildoq kartoshka.', 'Golden and crispy fries.', 'Золотистый хрустящий картофель.']
    },
    {
        id: 17, c: 'fries', p: 19000, r: 4.7, e: '🥔', pop: 83,
        n: ['Pishloqli fri', 'Cheese Fries', 'Фри с сыром'],
        d: ['Issiq pishloq sousi bilan quyilgan.', 'Topped with hot cheese sauce.', 'Под горячим сырным соусом.']
    },
    {
        id: 18, c: 'fries', p: 17000, r: 4.4, e: '🍠', pop: 62,
        n: ['Achchiq kartoshka bo‘laklari', 'Spicy Wedges', 'Острые дольки'],
        d: ['Ziravorlar bilan pishirilgan kartoshka.', 'Seasoned and oven-baked potato wedges.', 'Картофельные дольки со специями.']
    },
    // Chicken
    {
        id: 19, c: 'chicken', p: 45000, r: 4.8, e: '🍗', pop: 96,
        n: ['Qovurilgan tovuq (4 dona)', 'Fried Chicken (4 pcs)', 'Жареная курица (4 шт.)'],
        d: ['Qarsildoq qobiqli sersuv tovuq.', 'Juicy chicken in a crispy coating.', 'Сочная курица в хрустящей панировке.']
    },
    {
        id: 20, c: 'chicken', p: 42000, r: 4.7, e: '🔥', pop: 88,
        n: ['Tovuq qanotchalari', 'Chicken Wings', 'Куриные крылья'],
        d: ['Achchiq BBQ sousidagi qanotchalar.', 'Wings glazed in spicy BBQ sauce.', 'Крылья в остром соусе BBQ.']
    },
    {
        id: 21, c: 'chicken', p: 52000, r: 4.6, e: '🍖', pop: 66,
        n: ['Panjada pishgan tovuq', 'Grilled Chicken', 'Курица гриль'],
        d: ['Ziravorlar bilan marinadlangan tovuq filesi.', 'Marinated chicken fillet grilled to perfection.', 'Маринованное куриное филе на гриле.']
    },
    // Nuggets
    {
        id: 22, c: 'nuggets', p: 22000, r: 4.6, e: '🥡', pop: 86,
        n: ['Naggets (6 dona)', 'Nuggets (6 pcs)', 'Наггетсы (6 шт.)'],
        d: ['Tovuq go‘shtidan tayyorlangan qarsildoq naggetslar.', 'Crispy golden chicken nuggets.', 'Хрустящие куриные наггетсы.']
    },
    {
        id: 23, c: 'nuggets', p: 40000, r: 4.7, e: '🍱', pop: 79,
        n: ['Naggets (12 dona)', 'Nuggets (12 pcs)', 'Наггетсы (12 шт.)'],
        d: ['Katta oila uchun 12 dona naggets va 2 ta sous.', '12 nuggets with 2 sauces to share.', '12 наггетсов и 2 соуса на компанию.']
    },
    {
        id: 24, c: 'nuggets', p: 28000, r: 4.5, e: '🧆', pop: 58,
        n: ['Pishloqli naggets', 'Cheese Nuggets', 'Сырные наггетсы'],
        d: ['Ichi erigan pishloqqa to‘la.', 'Filled with gooey melted cheese.', 'С начинкой из тягучего сыра.']
    },
    // Drinks
    {
        id: 25, c: 'drinks', p: 9000, r: 4.5, e: '🥤', pop: 91,
        n: ['Kola 0.5 l', 'Cola 0.5 l', 'Кола 0.5 л'],
        d: ['Muzdek gazlangan ichimlik.', 'Ice-cold fizzy drink.', 'Ледяной газированный напиток.']
    },
    {
        id: 26, c: 'drinks', p: 12000, r: 4.6, e: '🍋', pop: 64,
        n: ['Uy limonadi', 'Homemade Lemonade', 'Домашний лимонад'],
        d: ['Yangi limon va yalpiz bilan.', 'Fresh lemon and mint.', 'Со свежим лимоном и мятой.']
    },
    {
        id: 27, c: 'drinks', p: 20000, r: 4.8, e: '🥛', pop: 84, isNew: true,
        n: ['Shokoladli milkshake', 'Chocolate Milkshake', 'Шоколадный милкшейк'],
        d: ['Quyuq, krem va muzqaymoqli.', 'Thick, creamy and made with ice cream.', 'Густой, сливочный, на мороженом.']
    },
    // Desserts
    {
        id: 28, c: 'desserts', p: 15000, r: 4.7, e: '🍦', pop: 82, isNew: true,
        n: ['Vanilli muzqaymoq', 'Vanilla Ice Cream', 'Ванильное мороженое'],
        d: ['Yumshoq vanilli muzqaymoq karamel bilan.', 'Soft vanilla ice cream with caramel.', 'Нежное ванильное мороженое с карамелью.']
    },
    {
        id: 29, c: 'desserts', p: 24000, r: 4.9, e: '🍰', pop: 89, isNew: true,
        n: ['Chizkeyk', 'Cheesecake', 'Чизкейк'],
        d: ['Nozik qaymoqli Nyu-York chizkeyki.', 'Creamy New York style cheesecake.', 'Нежный чизкейк в стиле Нью-Йорк.']
    },
    {
        id: 30, c: 'desserts', p: 21000, r: 4.8, e: '🍫', pop: 77, isNew: true,
        n: ['Shokoladli brauni', 'Chocolate Brownie', 'Шоколадный брауни'],
        d: ['Issiq shokoladli brauni yong‘oq bilan.', 'Warm chocolate brownie with walnuts.', 'Тёплый шоколадный брауни с грецким орехом.']
    }
];

const CATS = ['burgers', 'pizza', 'lavash', 'hotdogs', 'sandwiches', 'fries', 'chicken', 'nuggets', 'drinks', 'desserts'];

/* ---------- State ---------- */
let lang = LS.get('ff_lang', 'uz');
if (LANGS.indexOf(lang) === -1) lang = 'uz';
let theme = LS.get('ff_theme', 'light');
let cart = LS.get('ff_cart', []);        // [{id, qty}]
let favs = LS.get('ff_favs', []);        // [id]
let user = LS.get('ff_user', null);      // {first,last,email,phone} (no password!)
let users = LS.get('ff_users', []);      // demo registry (no passwords)
let orders = LS.get('ff_orders', []);
const filters = { q: '', cat: 'all', sort: 'popular' };

/* ---------- Helpers ---------- */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const li = () => LANGS.indexOf(lang);
const t = (k) => (T[k] ? T[k][li()] : k);
const pName = (p) => p.n[li()];
const pDesc = (p) => p.d[li()];
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const fmt = (n) => n.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ' + t('currency');
const gradient = (p) => {
    const h = (p.id * 47) % 55;
    return '--g1:hsl(' + h + ',95%,58%);--g2:hsl(' + (h + 18) + ',95%,50%)';
};

function cartSubtotal() {
    return cart.reduce((s, i) => { const p = byId(i.id); return s + (p ? p.p * i.qty : 0); }, 0);
}
function deliveryFor(sub) { return sub === 0 ? 0 : (sub >= FREE_FROM ? 0 : DELIVERY_FEE); }

let toastTimer;
function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- Layers (drawers / modals) ---------- */
function closeAll() {
    $$('.drawer.open, .modal.open').forEach((el) => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); });
    $('#overlay').classList.remove('show');
    document.body.classList.remove('no-scroll');
}
function openLayer(id) {
    closeAll();
    const el = document.getElementById(id);
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    $('#overlay').classList.add('show');
    document.body.classList.add('no-scroll');
}

/* ---------- Theme ---------- */
function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    $('#themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
    LS.set('ff_theme', theme);
}

/* ---------- Language ---------- */
function applyLang() {
    document.documentElement.lang = lang;
    LS.set('ff_lang', lang);
    $('#langSelect').value = lang;
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-err]').forEach((el) => { if (el.dataset.k) el.textContent = t(el.dataset.k); });
    document.title = 'FAST FOOD — ' + t('hero_title');
    renderAll();
}

/* ---------- Rendering ---------- */
function cardHTML(p) {
    const isFav = favs.indexOf(p.id) !== -1;
    const visual = p.img ? '<img src="' + p.img + '" alt="' + pName(p) + '" loading="lazy">' : '<span class="emoji">' + p.e + '</span>';
    return '<article class="card">' +
        '<div class="card-img" style="' + gradient(p) + '">' + visual +
        '<span class="cat-tag">' + t('cat_' + p.c) + '</span>' +
        (p.isNew ? '<span class="new-tag">' + t('new_tag') + '</span>' : '') +
        '<button class="fav-btn' + (isFav ? ' active' : '') + '" data-fav="' + p.id + '" aria-label="Favorite">♥</button></div>' +
        '<div class="card-body"><h3>' + pName(p) + '</h3><p>' + pDesc(p) + '</p>' +
        '<div class="rating">★ ' + p.r.toFixed(1) + '</div>' +
        '<div class="card-foot"><span class="price">' + fmt(p.p) + '</span>' +
        '<button class="btn btn-primary btn-sm" data-add="' + p.id + '">🛒 ' + t('add_to_cart') + '</button></div></div></article>';
}

function renderChips() {
    const all = ['all'].concat(CATS);
    $('#chips').innerHTML = all.map((c) =>
        '<button class="chip' + (filters.cat === c ? ' active' : '') + '" data-cat="' + c + '">' + t('cat_' + c) + '</button>').join('');
}

function getFiltered() {
    const q = filters.q.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
        if (filters.cat !== 'all' && p.c !== filters.cat) return false;
        if (!q) return true;
        return p.n.some((n) => n.toLowerCase().indexOf(q) !== -1);
    });
    const sorters = {
        popular: (a, b) => b.pop - a.pop,
        new: (a, b) => b.id - a.id,
        priceAsc: (a, b) => a.p - b.p,
        priceDesc: (a, b) => b.p - a.p,
        rating: (a, b) => b.r - a.r || b.pop - a.pop
    };
    list = list.slice().sort(sorters[filters.sort] || sorters.popular);
    return list;
}

function renderMenu() {
    renderChips();
    const list = getFiltered();
    $('#menuGrid').innerHTML = list.map(cardHTML).join('');
    $('#menuEmpty').hidden = list.length > 0;
    $('#resultCount').textContent = list.length + ' ' + t('found');
}

function renderPopular() {
    const top = PRODUCTS.slice().sort((a, b) => b.pop - a.pop).slice(0, 4);
    $('#popularGrid').innerHTML = top.map(cardHTML).join('');
}

function miniImg(p) {
    return '<div class="ci-img" style="' + gradient(p) + '">' + (p.img ? '<img src="' + p.img + '" alt="">' : p.e) + '</div>';
}

function renderCart() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    $('#cartCount').textContent = count;
    const box = $('#cartItems');
    if (!cart.length) {
        box.innerHTML = '<div class="empty-box"><div class="big">🛒</div><p>' + t('cart_empty') + '</p></div>';
        $('#cartFoot').hidden = true;
    } else {
        $('#cartFoot').hidden = false;
        box.innerHTML = cart.map((i) => {
            const p = byId(i.id);
            return '<div class="cart-item">' + miniImg(p) +
                '<div class="ci-info"><h4>' + pName(p) + '</h4><span class="price">' + fmt(p.p * i.qty) + '</span>' +
                '<div class="qty"><button data-dec="' + p.id + '" aria-label="-">−</button><b>' + i.qty + '</b><button data-inc="' + p.id + '" aria-label="+">+</button></div></div>' +
                '<button class="rm" data-rm="' + p.id + '" aria-label="Remove">🗑</button></div>';
        }).join('');
        $('#cartTotal').textContent = fmt(cartSubtotal());
    }
    LS.set('ff_cart', cart);
}

function renderFavs() {
    $('#favCount').textContent = favs.length;
    const box = $('#favItems');
    if (!favs.length) {
        box.innerHTML = '<div class="empty-box"><div class="big">💔</div><p>' + t('fav_empty') + '</p></div>';
    } else {
        box.innerHTML = favs.map((id) => {
            const p = byId(id);
            if (!p) return '';
            return '<div class="cart-item">' + miniImg(p) +
                '<div class="ci-info"><h4>' + pName(p) + '</h4><span class="price">' + fmt(p.p) + '</span>' +
                '<div class="qty"><button class="btn btn-primary btn-sm" data-add="' + p.id + '">🛒 ' + t('add_to_cart') + '</button></div></div>' +
                '<button class="rm" data-fav="' + p.id + '" aria-label="Remove">✕</button></div>';
        }).join('');
    }
    LS.set('ff_favs', favs);
}

function renderAuthBtn() {
    const label = user ? '👤 ' + user.first : t('nav_login');
    $('#authBtn').textContent = label;
    $('#mobileAuth').textContent = label;
}

function renderAccount() {
    if (!user) return;
    $('#accountInfo').innerHTML = '<b>' + user.first + ' ' + user.last + '</b><span>✉️ ' + user.email + '</span><span>📞 ' + user.phone + '</span>';
}

function renderOrders() {
    const box = $('#ordersList');
    if (!orders.length) { box.innerHTML = '<div class="empty-box"><div class="big">📦</div><p>' + t('orders_empty') + '</p></div>'; return; }
    box.innerHTML = orders.map((o) => {
        const items = o.items.map((i) => {
            const p = byId(i.id);
            return '<li><span>' + (p ? pName(p) : '#' + i.id) + ' × ' + i.qty + '</span><span>' + fmt(i.price * i.qty) + '</span></li>';
        }).join('');
        return '<div class="order"><div class="order-head"><b>' + t('order_no') + ': ' + o.id + '</b><small>' +
            new Date(o.date).toLocaleString(LOCALES[lang]) + '</small></div><ul>' + items + '</ul>' +
            '<div class="row total"><span>' + t('cart_total') + '</span><b>' + fmt(o.total) + '</b></div></div>';
    }).join('');
}

function renderCheckoutSummary() {
    const sub = cartSubtotal();
    const del = deliveryFor(sub);
    $('#ckItems').innerHTML = cart.map((i) => {
        const p = byId(i.id);
        return '<div class="line"><span>' + pName(p) + ' × ' + i.qty + '</span><span>' + fmt(p.p * i.qty) + '</span></div>';
    }).join('');
    $('#ckSub').textContent = fmt(sub);
    $('#ckDel').textContent = del === 0 ? t('free') : fmt(del);
    $('#ckTotal').textContent = fmt(sub + del);
}

function renderAll() {
    renderMenu();
    renderPopular();
    renderCart();
    renderFavs();
    renderAuthBtn();
    renderAccount();
    renderOrders();
    if ($('#checkoutModal').classList.contains('open')) renderCheckoutSummary();
}

/* ---------- Cart / Favorites actions ---------- */
function addToCart(id) {
    const item = cart.find((i) => i.id === id);
    if (item) item.qty += 1; else cart.push({ id: id, qty: 1 });
    renderCart();
    toast('🛒 ' + t('added'));
}
function changeQty(id, d) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += d;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
    renderCart();
}
function removeFromCart(id) {
    cart = cart.filter((i) => i.id !== id);
    renderCart();
}
function toggleFav(id) {
    const idx = favs.indexOf(id);
    if (idx === -1) { favs.push(id); toast('♥ ' + t('fav_added')); } else { favs.splice(idx, 1); toast(t('fav_removed')); }
    renderFavs();
    renderMenu();
    renderPopular();
}

/* ---------- Form validation ---------- */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const cleanPhone = (v) => v.replace(/[\s\-()]/g, '');
const isPhone = (v) => /^\+?\d{9,15}$/.test(cleanPhone(v));

function clearErrors(form) {
    $$('[data-err]', form).forEach((el) => { el.textContent = ''; el.dataset.k = ''; });
    $$('.field', form).forEach((f) => f.classList.remove('invalid'));
}
function setErr(form, name, key) {
    const el = $('[data-err="' + name + '"]', form);
    if (!el) return;
    el.dataset.k = key;
    el.textContent = t(key);
    const field = el.closest('.field');
    if (field) field.classList.add('invalid');
}
/* rules: { fieldName: (value, form) => errorKey | null } */
function validate(form, rules) {
    clearErrors(form);
    let ok = true;
    Object.keys(rules).forEach((name) => {
        const input = form.elements[name];
        const err = rules[name](input.value.trim(), form);
        if (err) { setErr(form, name, err); ok = false; }
    });
    return ok;
}
const req = (v) => (v ? null : 'err_required');
const reqEmail = (v) => (!v ? 'err_required' : (isEmail(v) ? null : 'err_email'));
const reqPhone = (v) => (!v ? 'err_required' : (isPhone(v) ? null : 'err_phone'));
const reqPass = (v) => (!v ? 'err_required' : (v.length < 6 ? 'err_pass_len' : null));

/* ---------- Auth (DEMO) ---------- */
function handleRegister(e) {
    e.preventDefault();
    const f = e.target;
    const ok = validate(f, {
        first: req, last: req, email: reqEmail, phone: reqPhone, password: reqPass,
        confirm: (v, form) => (!v ? 'err_required' : (v !== form.elements.password.value.trim() ? 'err_pass_match' : null))
    });
    if (!ok) return;
    const email = f.elements.email.value.trim().toLowerCase();
    const phone = cleanPhone(f.elements.phone.value);
    if (users.some((u) => u.email === email || u.phone === phone)) { setErr(f, 'email', 'err_exists'); return; }
    const newUser = { first: f.elements.first.value.trim(), last: f.elements.last.value.trim(), email: email, phone: phone };
    users.push(newUser);        // password intentionally NOT saved
    user = newUser;
    LS.set('ff_users', users);
    LS.set('ff_user', user);
    f.reset();
    closeAll();
    renderAuthBtn(); renderAccount();
    toast('👋 ' + t('welcome') + ', ' + user.first + '!');
}

function handleLogin(e) {
    e.preventDefault();
    const f = e.target;
    const ok = validate(f, { id: req, password: reqPass });
    if (!ok) return;
    const id = f.elements.id.value.trim();
    const found = users.find((u) => u.email === id.toLowerCase() || u.phone === cleanPhone(id));
    if (!found) { setErr(f, 'id', 'err_not_found'); return; }
    user = found;
    LS.set('ff_user', user);
    f.reset();
    closeAll();
    renderAuthBtn(); renderAccount();
    toast('👋 ' + t('welcome') + ', ' + user.first + '!');
}

function logout() {
    user = null;
    LS.set('ff_user', null);
    closeAll();
    renderAuthBtn();
    toast(t('logged_out'));
}

function openAuth() {
    if (user) { renderAccount(); openLayer('accountModal'); } else { openLayer('authModal'); }
}

/* ---------- Checkout ---------- */
function openCheckout() {
    if (!cart.length) { toast(t('ck_empty')); return; }
    openLayer('checkoutModal');
    const f = $('#checkoutForm');
    clearErrors(f);
    if (user) {
        if (!f.elements.first.value) f.elements.first.value = user.first;
        if (!f.elements.last.value) f.elements.last.value = user.last;
        if (!f.elements.phone.value) f.elements.phone.value = user.phone;
    }
    renderCheckoutSummary();
}

function handleCheckout(e) {
    e.preventDefault();
    const f = e.target;
    if (!cart.length) { toast(t('ck_empty')); return; }
    const ok = validate(f, { first: req, last: req, phone: reqPhone, address: req });
    if (!ok) return;
    const sub = cartSubtotal();
    const del = deliveryFor(sub);
    const order = {
        id: 'FF' + Date.now().toString().slice(-7),
        date: new Date().toISOString(),
        name: f.elements.first.value.trim() + ' ' + f.elements.last.value.trim(),
        phone: cleanPhone(f.elements.phone.value),
        address: f.elements.address.value.trim(),
        note: f.elements.note.value.trim(),
        items: cart.map((i) => ({ id: i.id, qty: i.qty, price: byId(i.id).p })),
        subtotal: sub, delivery: del, total: sub + del
    };
    orders.unshift(order);
    LS.set('ff_orders', orders);
    cart = [];
    f.reset();
    renderCart(); renderOrders();
    $('#successNo').textContent = order.id;
    openLayer('successModal');
}

/* ---------- Event delegation ---------- */
document.addEventListener('click', (e) => {
    const tg = e.target.closest('button, a, .faq-q');
    if (!tg) return;
    const d = tg.dataset;

    if (d.add) addToCart(+d.add);
    else if (d.fav) toggleFav(+d.fav);
    else if (d.inc) changeQty(+d.inc, 1);
    else if (d.dec) changeQty(+d.dec, -1);
    else if (d.rm) removeFromCart(+d.rm);
    else if (d.cat) { filters.cat = d.cat; renderMenu(); }
    else if (d.offer) {
        filters.cat = d.offer; filters.q = ''; $('#searchInput').value = '';
        renderMenu();
        $('#menu').scrollIntoView({ behavior: 'smooth' });
    }
    else if (d.close !== undefined) closeAll();
    else if (d.tab) {
        $$('.tab').forEach((b) => b.classList.toggle('active', b === tg));
        $('#loginForm').classList.toggle('hidden', d.tab !== 'login');
        $('#registerForm').classList.toggle('hidden', d.tab !== 'register');
    }
    else if (d.eye !== undefined) {
        const input = tg.parentElement.querySelector('input');
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        tg.textContent = show ? '🙈' : '👁';
    }
    else if (tg.classList.contains('faq-q')) {
        const item = tg.parentElement;
        const panel = $('.faq-a', item);
        const open = item.classList.toggle('open');
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0';
    }
});

/* ---------- Init ---------- */
function init() {
    $('#year').textContent = new Date().getFullYear();

    // Theme + language
    $('#themeBtn').addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; applyTheme(); });
    $('#langSelect').addEventListener('change', (e) => { lang = e.target.value; applyLang(); });

    // Hamburger
    const burger = $('#burger');
    const links = $('#navLinks');
    burger.addEventListener('click', () => { burger.classList.toggle('open'); links.classList.toggle('open'); });
    $$('a', links).forEach((a) => a.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); }));

    // Header buttons
    $('#cartBtn').addEventListener('click', () => openLayer('cartDrawer'));
    $('#favBtn').addEventListener('click', () => openLayer('favDrawer'));
    $('#authBtn').addEventListener('click', openAuth);
    $('#mobileAuth').addEventListener('click', (e) => { e.preventDefault(); burger.classList.remove('open'); links.classList.remove('open'); openAuth(); });
    $('#overlay').addEventListener('click', closeAll);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

    // Cart / checkout / account
    $('#checkoutBtn').addEventListener('click', openCheckout);
    $('#logoutBtn').addEventListener('click', logout);
    $('#accOrdersBtn').addEventListener('click', () => { renderOrders(); openLayer('ordersModal'); });
    $('#footerOrders').addEventListener('click', (e) => { e.preventDefault(); renderOrders(); openLayer('ordersModal'); });

    // Search + sort
    $('#searchInput').addEventListener('input', (e) => { filters.q = e.target.value; renderMenu(); });
    $('#sortSelect').addEventListener('change', (e) => { filters.sort = e.target.value; renderMenu(); });

    // Forms
    $('#loginForm').addEventListener('submit', handleLogin);
    $('#registerForm').addEventListener('submit', handleRegister);
    $('#checkoutForm').addEventListener('submit', handleCheckout);
    $('#contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        if (!validate(f, { name: req, email: reqEmail, message: req })) return;
        f.reset();
        toast('✅ ' + t('c_sent'));
    });

    applyTheme();
    applyLang();
}

document.addEventListener('DOMContentLoaded', init);