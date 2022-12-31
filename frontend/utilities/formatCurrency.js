// hydration error if undefined
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  currency: "EUR",
  style: "currency",
});

export function formatCurrency(number) {
  return CURRENCY_FORMATTER.format(number);
}
