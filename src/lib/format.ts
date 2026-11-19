const priceFormatter = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 });

export const formatPrice = (amount: number) => priceFormatter.format(amount);

export const isMonthlyUnit = (unit: string) => unit.includes('เดือน');
