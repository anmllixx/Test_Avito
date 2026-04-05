# Test_Avito
Тестовое задание для Авито

# Запуск автотестов

## Быстрый старт

Для запуска тестов выполните следующие команды:

### 1. Клонирование репозитория и установка зависимостей

```bash
git clone https://github.com/anmllixx/Test_Avito.git
cd Test_Avito
npm run install:all
```

### 2. Запуск всех тестов

```bash
npm test
```

### 3. Просмотр отчёта

```bash
npm run report
```

## Доступные команды

| Команда | Описание |
|---------|----------|
| `npm test` | Запустить все тесты (мобильные + десктоп) |
| `npm run test:mobile` | Только мобильные тесты (Pixel 7) |
| `npm run test:desktop` | Только десктопные тесты (Chrome) |
| `npm run report` | Открыть HTML-отчёт с результатами |

## Структура тестов
```text
tests/
├── desktop/
│   ├── price-filter.spec.js      # TC-001: Фильтр "Диапазон цен"
│   ├── sort-price.spec.js        # TC-002, TC-003: Сортировка по цене
│   ├── category-filter.spec.js   # TC-004: Фильтр "Категория"
│   ├── urgent-toggle.spec.js     # TC-005: Тогл "Только срочные"
│   └── stats-page.spec.js        # TC-006, TC-007, TC-008: Статистика
└── mobile/
    └── theme-switch.spec.js      # TC-009, TC-010: Переключение темы
