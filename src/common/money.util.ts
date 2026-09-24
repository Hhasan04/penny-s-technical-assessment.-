export function round2(value: number): number {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Format an amount for display, e.g. formatMoney(8500, 'USD') -> 'USD 8,500.00'. */
export function formatMoney(amount: number, currency: string): string {
	const fixed = round2(amount).toFixed(2);
	const [whole, frac] = fixed.split('.');
	const withSep = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return `${currency} ${withSep}.${frac}`;
}
