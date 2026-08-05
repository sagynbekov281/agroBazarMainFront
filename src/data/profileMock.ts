export const salesStats = [
  { label: 'Пн', value: 12000 },
  { label: 'Вт', value: 18500 },
  { label: 'Ср', value: 9000 },
  { label: 'Чт', value: 24000 },
  { label: 'Пт', value: 31000 },
  { label: 'Сб', value: 27000 },
  { label: 'Вс', value: 15000 },
]

export const mockOrders = [
  { id: '1042', product: 'Картофель', buyer: 'Айбек Т.', amount: 500, status: 'Новый', total: 17500 },
  { id: '1041', product: 'Морковь', buyer: 'Гульмира А.', amount: 200, status: 'В пути', total: 6000 },
  { id: '1040', product: 'Мёд', buyer: 'ОсОО «Нектар»', amount: 15, status: 'Завершён', total: 7350 },
  { id: '1039', product: 'Лук', buyer: 'Бекболот У.', amount: 300, status: 'Завершён', total: 10500 },
]

export const mockMessages = [
  { id: '1', from: 'Айбек Т.', preview: 'Здравствуйте, товар ещё в наличии?', time: '10:24', unread: true },
  { id: '2', from: 'Гульмира А.', preview: 'Когда будет доставка?', time: 'Вчера', unread: false },
  { id: '3', from: 'ОсОО «Нектар»', preview: 'Спасибо, заказ получен!', time: '2 дня назад', unread: false },
]