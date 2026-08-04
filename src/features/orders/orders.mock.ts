import type { Order } from "./orders.types";

// Hardcoded until the real order-feed API exists — shape/layout only, not final data.
export const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    passengerName: "Мая",
    rating: 5.0,
    ratingCount: 2,
    etaMinutes: 3,
    pricePerKm: 204.1,
    distanceKm: 0.8,
    price: 1000,
    isFairPrice: true,
    pickup: "микрорайон Мамыр-2, 3в (Алматы)",
    dropoff: "микрорайон Жетысу-2, 70а (Алматы)",
  },
  {
    id: "2",
    passengerName: "D",
    rating: 5.0,
    ratingCount: 3,
    etaMinutes: 3,
    pricePerKm: 181.8,
    distanceKm: 1,
    price: 1000,
    pickup: "микрорайон 10а, 22а (Алматы)",
    dropoff: "улица Ашимова, 122а (Алматы)",
  },
  {
    id: "3",
    passengerName: "Гульмира",
    rating: 4.6,
    ratingCount: 499,
    etaMinutes: 3,
    pricePerKm: 290.3,
    distanceKm: 1.2,
    price: 900,
    isFairPrice: true,
    pickup: "микрорайон Астана, 6 (Алматы)",
    dropoff: "улица Кыран, 9 (Алматы)",
    paymentTag: "Перевод на Kaspi",
  },
];
