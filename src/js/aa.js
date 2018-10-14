import data from "./consumeData";
import cash, { possessRate } from "./cashData";
import { PARTICIPANT, CURRENCY, PARTICIPANT_CH } from "./types";
import { exchangeToRMB } from "./utils";

import consumeRenderer from '../tpl/consumes.art';
import settlementRenderer from '../tpl/settlement.art';

// 初始化aa部分
export default function init() {
    // 计算人均消费等数据
    let results = calcAA();
    // 渲染需要展示的数据
    renderData(results);
}

export function calcAA() {
    let possesses = calcEveryonePossess();
    let consumes = calcEveryoneConsume();
    let debts = calcEveryoneDebt();
    console.log(debts);
    let totalPossess = getTotal(possesses);
    let totalConsume = getTotal(consumes);
    console.log(`总支出￥${totalPossess}`);
    console.log(`总消费￥${totalConsume}`);
    console.log(`未被记录的消费总额￥${totalPossess - totalConsume}, 人均￥${(totalPossess - totalConsume) / 4}`);
    let aaTracks = payByAA(debts);

    if (aaTracks) {
        aaTracks.map(item => {
            console.log(item);
        })
    }

    return {
        possesses,
        consumes,
        debts,
        totalPossess,
        totalConsume,
        aaTracks,
    };
    
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
        let debts = [];

        for (let consumer in consumes) {
            if (consumes.hasOwnProperty(consumer)) {
                if (consumer !== PARTICIPANT.CASH) {
                    let consume = consumes[consumer];
                    let possess = possesses[consumer];
                    let debt = possess - consume;
                    debts.push({
                        consumer,
                        num: debt,
                        currency: CURRENCY.RMB
                    });

                    console.log(`${consumer} 总共支出了￥${possess}, 消费了￥${consume} ${debt < 0 ? '需还￥' + Math.abs(debt) : ''}`);
                }
            }
        }

        return debts;
    }
}

export function payByAA(debts) {
    // 从大到小排序debts，从负值开始截断，以区分谁该向谁付钱
    debts = debts.sort((a, b) => b.num - a.num); 

    let [ payee, payer ] = truncateArrayFromNegative(debts);
    if (!payer || !payer.length) return null;
    return;

    let tracks = []; // string[], 记录每一笔偿还
    
    let i = 0; // payee游标
    let j = 0; // payer游标

    while (i !== payee.length && j !== payer.length) {
        let remain = payee[i] + payer[j];
        if (remain >= 0) {
            tracks.push(`payer${j} 应向 payee${i} 支付 ￥${Math.abs(payer[j])}`);
            payee[i] = remain;
            j++;
            remain === 0 && i++;
        }
        else if (remain < 0) {
            tracks.push(`payer${j} 应向 payee${i} 支付 ￥${payee[i]}`);
            payer[j] = remain; 
            i++;
        }
    }

    return tracks;
}

function truncateArrayFromNegative(arr) {
    let firstNegativeIndex = arr.findIndex(item => item.num < 0);
    if (firstNegativeIndex === -1) {
        return [arr, null];
    }
    return [arr.slice(0, firstNegativeIndex), arr.slice(firstNegativeIndex)];
}

function getTotal(nums) {
    let total = 0;

    for (let i in nums) {
        if (nums.hasOwnProperty(i)) {
            total += nums[i];            
        }
    }

    return total;
}

function renderData(results) {
    let dataCH = transDataToCH();
    renderConsumeTable(dataCH);
    renderSettlement(results);
}

function renderConsumeTable(data) {
    let html = consumeRenderer({
        list: data
    });
    $('.section-aa .consume-table-wrapper').html(html);
}

function renderSettlement(results) {
    let html = settlementRenderer({
        tracks: results.aaTracks,
        others: [
            {
                title: '总支出',
                num: results.totalPossess,
            },
            {
                title: '总消费',
                num: results.totalConsume,
            },
            {
                title: '未被记录的消费',
                num: results.totalPossess - results.totalConsume,
            },
        ]
    });
    $('.wrapper .settlement-wrapper').html(html);
}

function transDataToCH() {
    return data.map(item => {
        return Object.assign({}, item, {
            payerCH: PARTICIPANT_CH[item.payer],
            participantsCH: item.participants.map(p => {
                return PARTICIPANT_CH[p]
            })
        });
    });
}