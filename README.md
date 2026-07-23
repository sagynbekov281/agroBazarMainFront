# AgroBazar

Главная страница маркетплейса сельхозпродукции (React + TypeScript + Tailwind CSS v4), сверстанная по макету. Переключение языка (RU / EN) через `i18next`.

## Стек

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- i18next / react-i18next
- lucide-react (иконки)

## Запуск

```bash
npm install
npm run dev
```

Откройте адрес, который покажет консоль (обычно `http://localhost:5173`).

## Сборка

```bash
npm run build
npm run preview
```

## Структура

```
src/
  components/     # Header, Hero, Categories, Products, Farmers, Transport, PriceStats, Footer
  data/           # content.ts — товары, категории, фермеры, транспорт, статистика цен
  i18n/
    index.ts      # конфигурация i18next
    locales/
      ru.json     # русский (по умолчанию)
      en.json     # английский
  App.tsx
  main.tsx
  index.css       # подключение Tailwind
```

## Переключение языка

Кнопка **RU / EN** в шапке сайта переключает язык через `i18next.changeLanguage`. Выбор языка сохраняется в `localStorage`, поэтому при обновлении страницы язык не сбрасывается.

## Что дальше

Сейчас это главная страница (home) + футер, собранные по референсу. Каталог, карточка товара, страница фермера, корзина и т.д. — следующие экраны, которые можно добавить по такому же паттерну (компонент + переводы в `ru.json`/`en.json`).
