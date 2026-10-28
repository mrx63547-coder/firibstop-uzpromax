/* FiribStop — completes the Uzbek (UZ) translation.
 * Some screens of app.js contain Russian text written directly in templates, so they ignored the language switch.
 * While lang === 'uz' this file replaces exact known Russian phrases (text, title, aria-label, placeholder) with Uzbek.
 * Switching back to Russian restores the original text. Unknown text (e.g. news headlines) is never touched. */
(function () {
  'use strict';
  const DICT = {
"Секретные данные": "Maxfiy ma’lumotlar",
"Давление и угрозы": "Bosim va tahdidlar",
"Денежный перевод": "Pul o‘tkazmasi",
"Подозрительная ссылка": "Shubhali havola",
"Выигрыш или приз": "Yutuq yoki sovrin",
"Установка приложения / удалённый доступ": "Ilova o‘rnatish / masofaviy kirish",
"Возможная подмена личности": "Shaxsni almashtirish ehtimoli",
"Не устанавливайте файл из чата и не выдавайте удалённый доступ незнакомцу.": "Chatdagi faylni o‘rnatmang va begonaga masofaviy kirish bermang.",
"Завершите неожиданный разговор и сами позвоните по официальному номеру.": "Kutilmagan suhbatni tugating va rasmiy raqamga o‘zingiz qo‘ng‘iroq qiling.",
"Сегодняшний челлендж выполнен ✓": "Bugungi topshiriq bajarildi ✓",
"Сегодняшний челлендж выполнен": "Bugungi topshiriq bajarildi",
"Перейти к содержимому": "Asosiy mazmunga o‘tish",
"Проверка пароля": "Parolni tekshirish",
"Статистика": "Statistika",
"Схемы Узбекистана": "O‘zbekiston sxemalari",
"Режим для родителей": "Ota-onalar rejimi",
"Челлендж дня": "Kunlik topshiriq",
"Режим для школы": "Maktab rejimi",
"Резервная копия": "Zaxira nusxa",
"Новости кибербезопасности": "Kiberxavfsizlik yangiliklari",
"Онлайн": "Onlayn",
"Проверить ссылку": "Havolani tekshirish",
"Установить приложение": "Ilovani o‘rnatish",
"Печать / PDF": "Chop etish / PDF",
"Основная навигация": "Asosiy navigatsiya",
"Язык": "Til",
"Тема": "Mavzu",
"Переключить тему": "Mavzuni almashtirish",
"Свернуть меню": "Menyuni yig‘ish",
"Развернуть меню": "Menyuni yoyish",
"Крупный шрифт": "Yirik shrift",
"Открыть меню": "Menyuni ochish",
"Подключение к интернету есть": "Internet aloqasi bor",
"Нет подключения к интернету": "Internet aloqasi yo‘q",
"Экстренные контакты": "Favqulodda aloqa raqamlari",
"Важно": "Muhim",
"Введите пароль для оценки": "Baholash uchun parolni kiriting",
"Оценка выполняется прямо на устройстве. Пароль никуда не отправляется и не сохраняется.": "Baholash to‘g‘ridan-to‘g‘ri qurilmada bajariladi. Parol hech qayerga yuborilmaydi va saqlanmaydi.",
"Показать пароль": "Parolni ko‘rsatish",
"Введите пароль": "Parolni kiriting",
"Используйте длинную уникальную фразу, не повторяйте пароли между сайтами.": "Uzun va noyob iboradan foydalaning, parollarni saytlar o‘rtasida takrorlamang.",
"Очистить поле": "Maydonni tozalash",
"Правила хорошего пароля": "Yaxshi parol qoidalari",
"Лучше длинная парольная фраза из нескольких несвязанных слов.": "Bir-biriga bog‘liq bo‘lmagan bir necha so‘zdan iborat uzun parol ibora yaxshiroq.",
"Для каждого важного аккаунта — отдельный пароль.": "Har bir muhim akkaunt uchun alohida parol.",
"Храните пароли в надёжном менеджере и включайте двухфакторную защиту.": "Parollarni ishonchli menejerda saqlang va ikki bosqichli himoyani yoqing.",
"Оценка приблизительная и не проверяет, встречался ли пароль в утечках.": "Baho taxminiy bo‘lib, parol ma’lumotlar sizib chiqishida uchraganini tekshirmaydi.",
"Введите тестовый пароль": "Sinov parolini kiriting",
"Обзор локальной истории проверок.": "Mahalliy tekshiruvlar tarixi sharhi.",
"Всего проверок (история)": "Jami tekshiruvlar (tarix)",
"Высокий риск": "Yuqori xavf",
"Средний балл риска": "O‘rtacha xavf bali",
"Проверки за последние 7 дней": "So‘nggi 7 kundagi tekshiruvlar",
"График строится по локальной истории этого браузера.": "Grafik ushbu brauzerning mahalliy tarixi asosida tuziladi.",
"Распределение результатов": "Natijalar taqsimoti",
"Требует внимания": "E’tibor talab qiladi",
"Низкий риск": "Past xavf",
"Скачать резервную копию": "Zaxira nusxani yuklab olish",
"Импорт JSON": "JSON import qilish",
"Очистить историю": "Tarixni tozalash",
"Схемы мошенничества": "Firibgarlik sxemalari",
"Обучающие примеры, актуальные для распространённых сценариев в Узбекистане. Это общий справочник, а не подтверждённые текущие случаи.": "O‘zbekistonda keng tarqalgan stsenariylar uchun o‘quv misollari. Bu umumiy ma’lumotnoma bo‘lib, tasdiqlangan joriy holatlar emas.",
"1. Ложная доставка": "1. Soxta yetkazib berish",
"SMS сообщает о небольшой доплате и просит открыть ссылку для получения посылки.": "SMS kichik qo‘shimcha to‘lov haqida xabar beradi va posilkani olish uchun havolani ochishni so‘raydi.",
"Как защититься:": "Qanday himoyalanish kerak:",
"Не вводите данные карты по ссылке из SMS. Откройте приложение службы доставки самостоятельно.": "SMS dagi havola orqali karta ma’lumotlarini kiritmang. Yetkazib berish xizmati ilovasini o‘zingiz oching.",
"2. Банковская безопасность": "2. Bank xavfsizligi",
"Звонящий представляется сотрудником банка и просит код из SMS или данные карты.": "Qo‘ng‘iroq qiluvchi bank xodimi sifatida tanishtiradi va SMS-kod yoki karta ma’lumotlarini so‘raydi.",
"Завершите разговор. Позвоните в банк по номеру с официальной карты или сайта.": "Suhbatni tugating. Bankka kartadagi yoki rasmiy saytdagi raqam orqali qo‘ng‘iroq qiling.",
"3. Фальшивая вакансия": "3. Soxta vakansiya",
"Обещают большую зарплату без опыта и требуют оплатить регистрацию или обучение.": "Tajribasiz katta maosh va’da qilishadi va ro‘yxatdan o‘tish yoki o‘qish uchun to‘lov talab qilishadi.",
"Не переводите деньги за трудоустройство, проверяйте компанию и договор.": "Ishga joylashish uchun pul o‘tkazmang, kompaniya va shartnomani tekshiring.",
"4. Инвестиционная пирамида": "4. Investitsion piramida",
"Поддельный розыгрыш": "Soxta yutuq o‘yini",
"Инвестиционная пирамида": "Investitsion piramida",
"Обещают гарантированный доход, быстрый заработок и бонус за приглашение друзей.": "Kafolatlangan daromad, tez pul topish va do‘stlarni taklif qilgani uchun bonus va’da qilinadi.",
"Гарантированная высокая прибыль — серьёзный сигнал риска. Не отправляйте деньги под давлением.": "Kafolatlangan yuqori foyda — jiddiy xavf belgisi. Bosim ostida pul yubormang.",
"5. Поддельный розыгрыш": "5. Soxta yutuq o‘yini",
"Сообщают о выигрыше, но требуют оплатить комиссию или отправить код.": "Yutuq haqida xabar berishadi, lekin komissiya to‘lash yoki kod yuborishni talab qilishadi.",
"Не платите за получение неожиданного приза и не сообщайте коды.": "Kutilmagan sovrinni olish uchun to‘lamang va kodlarni aytmang.",
"6. Мошенничество от имени близкого": "6. Yaqin kishi nomidan firibgarlik",
"С аккаунта знакомого срочно просят деньги или код.": "Tanishning akkauntidan shoshilinch pul yoki kod so‘rashadi.",
"Свяжитесь с человеком другим способом и задайте контрольный вопрос.": "Inson bilan boshqa usulda bog‘laning va nazorat savolini bering.",
"7. Фальшивая служба поддержки": "7. Soxta qo‘llab-quvvatlash xizmati",
"Просят установить AnyDesk/другое удалённое управление или включить демонстрацию экрана.": "AnyDesk yoki boshqa masofaviy boshqaruv dasturini o‘rnatish yoki ekranni namoyish qilishni so‘rashadi.",
"Не давайте удалённый доступ к устройству и банковским приложениям.": "Qurilma va bank ilovalariga masofaviy kirishga ruxsat bermang.",
"8. Поддельный QR-код": "8. Soxta QR-kod",
"QR-код ведёт на копию сайта банка, платёжную форму или неизвестный домен.": "QR-kod bank saytining nusxasiga, to‘lov shakliga yoki noma’lum domenga olib boradi.",
"После сканирования проверьте полный домен и не вводите пароли с неожиданной страницы.": "Skanerlagandan so‘ng to‘liq domenni tekshiring va kutilmagan sahifada parol kiritmang.",
"9. Фишинг в мессенджере": "9. Messenjerdagi fishing",
"Сообщение содержит угрозу блокировки аккаунта и ссылку «подтвердить вход».": "Xabarda akkaunt bloklanishi tahdidi va «kirishni tasdiqlash» havolasi bor.",
"Откройте официальный сайт вручную и проверьте уведомления в приложении.": "Rasmiy saytni qo‘lda oching va ilovadagi bildirishnomalarni tekshiring.",
"10. Предоплата за товар": "10. Tovar uchun oldindan to‘lov",
"Продавец требует полную предоплату вне площадки и торопит с переводом.": "Sotuvchi platformadan tashqarida to‘liq oldindan to‘lov talab qiladi va o‘tkazmaga shoshiltiradi.",
"Используйте защищённую оплату площадки и проверяйте продавца.": "Platformaning himoyalangan to‘lovidan foydalaning va sotuvchini tekshiring.",
"Простой экран для пожилых близких: крупный текст, озвучивание, проверка просьб о деньгах и связь с доверенным человеком.": "Keksa yaqinlar uchun oddiy ekran: yirik matn, ovozli o‘qish, pul so‘rovlarini tekshirish va ishonchli inson bilan aloqa.",
"Прочитать последний результат": "So‘nggi natijani o‘qib berish",
"Показать сообщение близкому": "Xabarni yaqin kishiga ko‘rsatish",
"Перед переводом денег": "Pul o‘tkazishdan oldin",
"Не торопитесь. Не сообщайте SMS-коды, PIN, CVV и пароли. Позвоните близкому по уже известному номеру, а не по номеру из нового сообщения.": "Shoshilmang. SMS-kodlar, PIN, CVV va parollarni aytmang. Yaqin kishiga yangi xabardagi raqamga emas, oldindan ma’lum bo‘lgan raqamga qo‘ng‘iroq qiling.",
"Открыть семейную защиту": "Oilaviy himoyani ochish",
"Проверить ссылку или сообщение": "Havola yoki xabarni tekshirish",
"Кодовое слово семьи": "Oilaviy kod so‘zi",
"Выберите отдельное слово, не связанное с паролями и PIN. Настроить его и контакты можно в FiribStop Family.": "Parollar va PIN bilan bog‘liq bo‘lmagan alohida so‘z tanlang. Uni va kontaktlarni FiribStop Family bo‘limida sozlash mumkin.",
"Настроить семью": "Oilani sozlash",
"Семейная защита от мошенничества: доверенные контакты, кодовое слово и быстрая проверка подозрительных просьб. Данные профиля сохраняются только на этом устройстве.": "Firibgarlikdan oilaviy himoya: ishonchli kontaktlar, kod so‘zi va shubhali so‘rovlarni tezkor tekshirish. Profil ma’lumotlari faqat shu qurilmada saqlanadi.",
"Правило семьи: остановись → проверь → перезвони": "Oila qoidasi: to‘xta → tekshir → qayta qo‘ng‘iroq qil",
"Срочная просьба о деньгах от «ребёнка», «банка» или «службы поддержки» всегда требует проверки по независимому каналу.": "«Farzand», «bank» yoki «qo‘llab-quvvatlash xizmati»dan shoshilinch pul so‘rovi doim mustaqil kanal orqali tekshirilishi kerak.",
"1. Контакты доверия": "1. Ishonchli kontaktlar",
"Имя члена семьи": "Oila a’zosining ismi",
"Кто он для вас": "U siz uchun kim",
"Доверенный контакт №1 — имя": "Ishonchli kontakt №1 — ism",
"Телефон №1": "Telefon №1",
"Доверенный контакт №2 — имя": "Ishonchli kontakt №2 — ism",
"Телефон №2": "Telefon №2",
"Сохранить профиль": "Profilni saqlash",
"Номер телефона хранится локально. Не указывайте чужие номера без согласия владельца.": "Telefon raqami mahalliy saqlanadi. Egasining roziligisiz begona raqamlarni kiritmang.",
"2. Семейное кодовое слово": "2. Oilaviy kod so‘zi",
"Придумайте слово, которое знают только близкие. При неожиданной просьбе о деньгах спросите его и дополнительно перезвоните по сохранённому номеру.": "Faqat yaqinlaringiz biladigan so‘z o‘ylab toping. Kutilmagan pul so‘rovida uni so‘rang va saqlangan raqamga qo‘shimcha qayta qo‘ng‘iroq qiling.",
"Ваше кодовое слово": "Sizning kod so‘zingiz",
"Показать / скрыть": "Ko‘rsatish / yashirish",
"Сохранить слово": "So‘zni saqlash",
"Это слово не отправляется при анализе сообщений. Не используйте банковские пароли, PIN или коды восстановления.": "Bu so‘z xabarlarni tahlil qilishda yuborilmaydi. Bank parollari, PIN yoki tiklash kodlaridan foydalanmang.",
"3. Проверьте подозрительную просьбу": "3. Shubhali so‘rovni tekshiring",
"Вставьте сообщение, где родственник срочно просит деньги, код или установить приложение. Текст анализируется существующим движком FiribStop.": "Qarindosh shoshilinch pul, kod so‘rayotgan yoki ilova o‘rnatishni so‘rayotgan xabarni joylashtiring. Matn FiribStop’ning mavjud tahlil dvigateli bilan tahlil qilinadi.",
"Проверить сообщение": "Xabarni tekshirish",
"Открыть полный анализатор": "To‘liq tahlilchini ochish",
"4. Быстро связаться": "4. Tez bog‘lanish",
"Контакт не добавлен. Сохраните доверенный номер выше.": "Kontakt qo‘shilmagan. Ishonchli raqamni yuqorida saqlang.",
"Отправить близким памятку безопасности": "Yaqinlarga xavfsizlik eslatmasini yuborish",
"Экстренная помощь": "Favqulodda yordam",
"5. Семейная памятка": "5. Oilaviy eslatma",
"Никогда не сообщайте SMS/OTP-коды, PIN и CVV.": "SMS/OTP-kodlar, PIN va CVV’ni hech qachon aytmang.",
"Перепроверяйте новую просьбу о деньгах звонком на старый номер.": "Pul haqidagi yangi so‘rovni eski raqamga qo‘ng‘iroq qilib qayta tekshiring.",
"Не устанавливайте APK или приложения удалённого доступа по просьбе звонящего.": "Qo‘ng‘iroq qiluvchining iltimosi bilan APK yoki masofaviy kirish ilovalarini o‘rnatmang.",
"При подозрении остановите платёж, сохраните скриншоты и свяжитесь с банком через официальный канал.": "Shubha tug‘ilsa, to‘lovni to‘xtating, skrinshotlarni saqlang va bank bilan rasmiy kanal orqali bog‘laning.",
"Скопировать памятку": "Eslatmani nusxalash",
"Например, мама": "Masalan, ona",
"Родитель / ребёнок / близкий": "Ota-ona / farzand / yaqin kishi",
"Не используйте PIN или пароль": "PIN yoki paroldan foydalanmang",
"Например: Мама, срочно переведи деньги на новую карту…": "Masalan: Ona, shoshilinch yangi kartaga pul o‘tkaz…",
"Основные проверки выполняются на устройстве. Локальный анализ не требует API-ключей.": "Asosiy tekshiruvlar qurilmada bajariladi. Mahalliy tahlil API kalitlarini talab qilmaydi.",
"Работает офлайн": "Oflayn ishlaydi",
"Проверка текста по локальным правилам": "Matnni mahalliy qoidalar bo‘yicha tekshirish",
"История проверок": "Tekshiruvlar tarixi",
"Учебные примеры и памятки": "O‘quv misollari va eslatmalar",
"Проверка паролей": "Parollarni tekshirish",
"Приватность": "Maxfiylik",
"Текст анализируется локальными правилами": "Matn mahalliy qoidalar bilan tahlil qilinadi",
"Результаты сохраняются на устройстве": "Natijalar qurilmada saqlanadi",
"Серия дней:": "Kunlar seriyasi:",
"· Уровень:": "· Daraja:",
"Новичок": "Yangi boshlovchi",
"Выполнить челлендж": "Topshiriqni bajarish",
"Учебный совет из каталога; это не новостная сводка.": "Katalogdagi o‘quv maslahati; bu yangiliklar xulosasi emas.",
"Режим для школ и колледжей": "Maktab va kollejlar uchun rejim",
"Материал для классного часа. Можно выводить на проектор и печатать отчёт без персональных данных.": "Sinf soati uchun material. Proyektorda ko‘rsatish va shaxsiy ma’lumotlarsiz hisobotni chop etish mumkin.",
"План занятия · 15 минут": "Dars rejasi · 15 daqiqa",
"3 минуты — признаки мошенничества": "3 daqiqa — firibgarlik belgilari",
"5 минут — разбор учебного сообщения": "5 daqiqa — o‘quv xabarini tahlil qilish",
"5 минут — интерактивный тренажёр": "5 daqiqa — interaktiv trenajyor",
"2 минуты — выводы: остановись, проверь, перезвони": "2 daqiqa — xulosalar: to‘xta, tekshir, qayta qo‘ng‘iroq qil",
"Начать тренажёр": "Trenajyorni boshlash",
"Открыть тест": "Testni ochish",
"Скачать отчёт JSON": "JSON hisobotni yuklab olish",
"Данные остаются в этом браузере. Экспортируйте их перед очисткой истории или сменой устройства.": "Ma’lumotlar shu brauzerda qoladi. Tarixni tozalash yoki qurilmani almashtirishdan oldin ularni eksport qiling.",
"Экспорт": "Eksport",
"Сохраните историю в JSON, чтобы восстановить её позже.": "Keyinroq tiklash uchun tarixni JSON formatida saqlang.",
"Импорт и восстановление": "Import va tiklash",
"Выберите JSON, созданный FiribStop UZ. Совпадающие записи объединяются, история ограничивается 60 последними проверками.": "FiribStop UZ yaratgan JSON faylni tanlang. Mos yozuvlar birlashtiriladi, tarix oxirgi 60 ta tekshiruv bilan cheklanadi.",
"Выбрать JSON-файл": "JSON faylni tanlash",
"Русскоязычная лента: заголовки и краткие описания загружаются прямо в FiribStop. Для подробностей можно открыть первоисточник, но переходить на сайт не нужно, чтобы просмотреть сводку.": "Rus tilidagi lenta: sarlavhalar va qisqa tavsiflar to‘g‘ridan-to‘g‘ri FiribStop’ga yuklanadi. Tafsilotlar uchun birlamchi manbani ochish mumkin, ammo xulosani ko‘rish uchun saytga o‘tish shart emas.",
"ПОСЛЕДНИЕ ПУБЛИКАЦИИ": "SO‘NGGI NASHRLAR",
"Лента новостей": "Yangiliklar lentasi",
"Обновить": "Yangilash",
"Только важное": "Faqat muhimi",
"Не удалось связаться с API ленты. Частая причина на Netlify: включена защита паролем (Visitor Access / Password protection) — тогда /api/news отдаёт HTML-вход (401) вместо JSON. Отключите пароль сайта в Site configuration → Access control или сделайте Deploy без Visitor Access. Проверьте: /api/health должен открываться JSON с ok: true, /api/news — JSON с items. Нужны netlify.toml и netlify/functions/news.js. Если API на другом домене — укажите HTTPS в настройках и CORS_ORIGINS.": "Lenta API’si bilan bog‘lanib bo‘lmadi. Netlify’da tez-tez uchraydigan sabab: parol himoyasi yoqilgan (Visitor Access / Password protection) — shunda /api/news JSON o‘rniga HTML kirish sahifasini (401) qaytaradi. Sayt parolini Site configuration → Access control bo‘limida o‘chiring yoki Visitor Access’siz Deploy qiling. Tekshiring: /api/health JSON ok: true bilan, /api/news esa items bilan JSON qaytarishi kerak. netlify.toml va netlify/functions/news.js kerak. API boshqa domenda bo‘lsa, sozlamalarda HTTPS manzilini va CORS_ORIGINS ni ko‘rsating.",
"Живая лента временно недоступна": "Jonli lenta vaqtincha mavjud emas",
"Проверьте API-сервер": "API-serverni tekshiring",
"Проверьте, что": "Tekshiring:",
"возвращает JSON, а не HTML-страницу ошибки.": "HTML xato sahifasi emas, JSON qaytarishi kerak.",
"Это ссылки на источники, а не подставные новости. FiribStop не показывает выдуманные публикации при сбое сети.": "Bu manbalarga havolalar, soxta yangiliklar emas. Tarmoq ishdan chiqqanda FiribStop to‘qima nashrlarni ko‘rsatmaydi.",
"Новости поступают из русскоязычных RSS-лент. Заголовок и краткая сводка отображаются внутри интерфейса; ссылка на оригинал оставлена для проверки источника. Статистика публикаций не равна числу подтверждённых атак.": "Yangiliklar rus tilidagi RSS-lentalardan keladi. Sarlavha va qisqa xulosa interfeys ichida ko‘rsatiladi; asl nusxaga havola manbani tekshirish uchun qoldirilgan. Nashrlar statistikasi tasdiqlangan hujumlar soniga teng emas.",
"КАК ЧИТАТЬ ЛЕНТУ": "LENTANI QANDAY O‘QISH KERAK",
"Сводки внутри приложения": "Ilova ichidagi xulosalar",
"Здесь отображаются дата, источник, категория и краткое описание каждой публикации. Фильтруйте ленту по словам или включите режим «Только важное».": "Bu yerda har bir nashrning sanasi, manbasi, toifasi va qisqa tavsifi ko‘rsatiladi. Lentani so‘zlar bo‘yicha filtrlang yoki «Faqat muhimi» rejimini yoqing.",
"Смотрите дату": "Sanaga qarang",
"Старые материалы могут описывать уже закрытые инциденты.": "Eski materiallar allaqachon yopilgan hodisalarni tasvirlashi mumkin.",
"Проверяйте источник": "Manbani tekshiring",
"Ссылка «Первоисточник» нужна для проверки деталей, а не для просмотра самой ленты.": "«Birlamchi manba» havolasi tafsilotlarni tekshirish uchun, lentaning o‘zini ko‘rish uchun emas.",
"Не путайте публикации и атаки": "Nashrlar va hujumlarni adashtirmang",
"Несколько публикаций могут относиться к одному событию.": "Bir nechta nashr bitta voqeaga tegishli bo‘lishi mumkin.",
"При недоступности сети FiribStop покажет ранее сохранённые публикации, если они есть.": "Tarmoq mavjud bo‘lmasa, FiribStop avval saqlangan nashrlarni (agar bor bo‘lsa) ko‘rsatadi.",
"Обновить новости": "Yangiliklarni yangilash",
"Поиск по новостям": "Yangiliklar bo‘yicha qidiruv",
"Поиск по новостям…": "Yangiliklar bo‘yicha qidiruv…"
};
  const RULES = [["^(\\d+) проверок$", "$1 ta tekshiruv"]].map(([re, to]) => [new RegExp(re, 'u'), to]);
  const CYR = /[А-Яа-яЁё]/;
  const LEAD = /^([^\p{L}\p{N}]*)([\s\S]*)$/u;
  const ATTRS = ['title', 'aria-label', 'placeholder'];
  const origText = new Map();
  let applying = false;

  const isUz = () => { try { return lang === 'uz'; } catch (e) { return false; } };

  function lookup(core) {
    if (Object.prototype.hasOwnProperty.call(DICT, core)) return DICT[core];
    for (const [re, to] of RULES) if (re.test(core)) return core.replace(re, to);
    return null;
  }
  function translate(str) {
    const full = str.trim();
    if (!full || !CYR.test(full)) return null;
    let r = lookup(full);
    if (r == null) {
      const m = LEAD.exec(full);
      const pre = m[1], rest = m[2];
      r = lookup(rest);
      if (r != null) return str.replace(full, () => pre + r);
      const tail = /[^\p{L}\p{N}]*$/u.exec(rest)[0];
      const core = tail ? rest.slice(0, rest.length - tail.length) : rest;
      r = core ? lookup(core) : null;
      if (r == null) return null;
      return str.replace(full, () => pre + r + tail);
    }
    return str.replace(full, () => r);
  }

  function apply() {
    if (applying || !document.body) return;
    applying = true;
    try {
      const uz = isUz();
      // restore original text when the language is not UZ
      if (!uz) {
        origText.forEach((orig, node) => {
          if (node.isConnected && node.nodeValue !== orig) node.nodeValue = orig;
          if (!node.isConnected) origText.delete(node);
        });
        document.querySelectorAll('[data-fs-orig]').forEach((el) => {
          try {
            const o = JSON.parse(el.getAttribute('data-fs-orig'));
            for (const a in o) el.setAttribute(a, o[a]);
            el.removeAttribute('data-fs-orig');
          } catch (e) {}
        });
        return;
      }
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const p = node.parentElement;
        if (!p || p.tagName === 'SCRIPT' || p.tagName === 'STYLE' || p.tagName === 'TEXTAREA') continue;
        const val = node.nodeValue;
        if (!CYR.test(val)) continue;
        const out = translate(val);
        if (out != null && out !== val) {
          if (!origText.has(node)) origText.set(node, val);
          node.nodeValue = out;
        }
      }
      document.querySelectorAll('[title],[aria-label],[placeholder]').forEach((el) => {
        let saved = null;
        for (const a of ATTRS) {
          const v = el.getAttribute(a);
          if (!v || !CYR.test(v)) continue;
          const out = translate(v);
          if (out != null && out !== v) {
            if (!saved) { try { saved = JSON.parse(el.getAttribute('data-fs-orig') || '{}'); } catch (e) { saved = {}; } }
            if (!(a in saved)) saved[a] = v;
            el.setAttribute(a, out);
          }
        }
        if (saved) el.setAttribute('data-fs-orig', JSON.stringify(saved));
      });
    } finally {
      applying = false;
    }
  }

  function start() {
    apply();
    const obs = new MutationObserver(() => { apply(); obs.takeRecords(); });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  window.FiribStopUzFix = { apply, translate, size: Object.keys(DICT).length };
})();
