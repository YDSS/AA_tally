import Rate from './exchangeRate';
import data from './consumeData';
import cash, { possessRate } from './cashData';
import { PARTICIPANT, CURRENCY } from './types';

export default function aa() {
    let consumes = calcEveryoneConsume(); 
    let debts = {};

    for (consumer of consumes) {
        if (consumer !== PARTICIPANT.CASH) {
            let consume = consumes[consumer];
            let possess = possessRate[consumer] * cash.num;
            let debt = possess - consume;
            debts[consumer] = {
                num: debt,
                currency: CURRENCY.DH
            };

            console.log(`${consumer} has debt DH ${debt}`);
        }
    }

    return debts;
}

function calcEveryoneConsume() {

}
