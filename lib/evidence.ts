/** How much one accepted observation adds to a spring's evidence score (1 = a full independent line of evidence).
 * Tracer and isotope tests test the recharge link directly; field readings only support it. Tune with a hydrogeologist. */
export const WEIGHTS: Record<string, number> = { dye_trace: 1, isotope: 0.8, discharge: 0.4, ec_temp: 0.3, lineament: 0.3 };
export const weightOf = (kind: string) => WEIGHTS[kind] ?? 0.2;
