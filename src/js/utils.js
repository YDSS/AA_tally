import exchangeRate from './exchangeRate';
import { CURRENCY } from './types';

export function exchangeToRMB({value, currency}) {
    if (currency === CURRENCY.RMB) {
        return value;
    }

    let rate = exchangeRate[currency];
    return value * rate;
}