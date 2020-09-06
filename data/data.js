export const slideData = [
  { title: "Comparte", text: "Comparte tus habilidades \ny pasiones" },
  {
    title: "Nuestra moneda \ne sel tiempo",
    text: "Gánalo y gástalo como si \nfuera dinero",
  },
  {
    title: "Recauda",
    text: "Reacuda tiempo y recoge evaluaciones positivas",
  },
  {
    title: "Gasta",
    text: "Con el tiempo ganado \nsatisface tus necesidades",
  },
];

export const listHours = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
].map((item) => ({
  value: item,
  label: item + (item === 1 ? " hora" : " horas"),
}));

export const listMinutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
  (item) => ({
    value: item * 5,
    label: item * 5 + " min",
  })
);
