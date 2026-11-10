const nf0 = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** "$2.040.000", rounded to the thousand */
export const clp = (n: number) => `$${nf0.format(Math.round(n / 1000) * 1000)}`;
/** "$2,0 millones" */
export const millones = (n: number) => `$${nf1.format(n / 1e6)} millones`;
/** short axis label: "1,5 M" */
export const mCorto = (n: number) => (n === 0 ? "0" : `${nf1.format(n / 1e6)} M`);
