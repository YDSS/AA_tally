import data from "./consumeData";
import cash, { possessRate } from "./cashData";
import { PARTICIPANT, CURRENCY } from "./types";
import { exchangeToRMB } from "./utils";

export default function aa() {
    let possesses = calcEveryonePossess();
    let consumes = calcEveryoneConsume();
    let debts = calcEveryoneDebt();

    function calcEveryoneConsume() {
        // 初始化消费者
        let consumes = {};
        for (let consumer in PARTICIPANT) {
            if (PARTICIPANT.hasOwnProperty(consumer) && consumer !== PARTICIPANT.CASH) {
                consumes[consumer] = 0;
            }
        }

        data.map(item => {
            let { payer, payment, currency, participants } = item;
            // 费用转成RMB
            payment = exchangeToRMB({
                value: payment,
                currency
            });
            let numOfParticipant = participants.length;
            let sharedFee = payment / numOfParticipant;

            // 费用由某个参与者支付，总费用要算到他的possess里
            if (payer !== PARTICIPANT.CASH) {
                possesses[payer] += payment;
            }
            // 参与者均摊
            participants.map(participant => {
                consumes[participant] += sharedFee;
            });
        });
        return consumes;
    }

    function calcEveryonePossess() {
        let possesses = {};
        // 将cash转成RMB，便于计算
        if (cash.currency !== CURRENCY.RMB) {
            cash.num = exchangeToRMB({
                value: cash.num, 
                currency: cash.currency,
            });
            cash.currency = CURRENCY.RMB;
        }
        for (let participant in PARTICIPANT) {
            if (PARTICIPANT.hasOwnProperty(participant) && participant !== PARTICIPANT.CASH) {
                possesses[participant] = possessRate[participant] * cash.num;
            }
        }

        return possesses;
    }

    function calcEveryoneDebt() {
        let debts = {};

        for (let consumer in consumes) {
            if (consumes.hasOwnProperty(consumer)) {
                if (consumer !== PARTICIPANT.CASH) {
                    let consume = consumes[consumer];
                    let possess = possesses[consumer];
                    let debt = possess - consume;
                    debts[consumer] = {
                        num: debt,
                        currency: CURRENCY.DH
                    };

                    console.log(`${consumer} has debt ￥${debt}`);
                }
            }
        }

        return debts;
    }
}
