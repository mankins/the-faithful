const formatCurrency = (amount = "0", currency = "usd", locale = "en-US") => {
  const formatter = new Intl.NumberFormat(locale, {
    // en-US
    style: "currency",
    currency: currency, // usd
  });

  return formatter.format(amount/100);
};

module.exports = { formatCurrency };
