import data from "./consumeData";
import cash, { possessRate } from "./cashData";
import { PARTICIPANT, CURRENCY, PARTICIPANT_CH } from "./types";
import { exchangeToRMB } from "./utils";

import consumeRenderer from "../tpl/consumes.art";
import settlementRenderer from "../tpl/settlement.art";

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
    toFixed2(possesses, consumes);

    let { debts, debtsTrack } = calcEveryoneDebt();
    console.log(debts);
    let totalPossess = +(getTotal(possesses).toFixed(2));
    let totalConsume = +(getTotal(consumes).toFixed(2));
    let untracked = +(totalPossess - totalConsume).toFixed(2);
    console.log(`总支出￥${totalPossess}`);
    console.log(`总消费￥${totalConsume}`);
    console.log(`未被记录的消费总额￥${untracked}, 人均￥${untracked / 4}`);
    // 把未被记录的消费平摊到每个人的消费里
    Object.keys(consumes).map(consumer => {
        consumes[consumer] += untracked / 4;
    });
    let aaTracks = payByAA(debts);

    if (aaTracks) {
        aaTracks.map(item => {
            console.log(item);
        });
    }

    return {
        possesses,
        consumes,
        debts,
        debtsTrack,
        totalPossess,
        totalConsume,
        aaTracks
    };

    function calcEveryoneConsume() {
        // 初始化消费者
        let consumes = {};
        for (let consumer in PARTICIPANT) {
            if (
                PARTICIPANT.hasOwnProperty(consumer) &&
                consumer !== PARTICIPANT.CASH &&
                consumer !== "ALL"
            ) {
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
                currency: cash.currency
            });
            cash.currency = CURRENCY.RMB;
        }
        for (let participant in PARTICIPANT) {
            if (
                PARTICIPANT.hasOwnProperty(participant) &&
                participant !== PARTICIPANT.CASH &&
                participant !== "ALL"
            ) {
                possesses[participant] = possessRate[participant] * cash.num;
            }
        }

        return possesses;
    }

    function calcEveryoneDebt() {
        let debts = [];
        let debtsTrack = [];

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

                    console.log(
                        `${consumer} 总共支出了￥${possess}, 消费了￥${consume} ${
                            debt < 0 ? "需还￥" + Math.abs(debt) : ""
                        }`
                    );
                    debtsTrack.push(
                        `<em>${consumer}</em> 总共支出了<strong>￥${possess}</strong>, 消费了<strong>￥${consume}</strong> ${
                            debt < 0 ? "需还<strong>￥" + Math.abs(debt) + '</strong>' : ""
                        }`
                    )
                }
            }
        }

        return {
            debts,
            debtsTrack
        };
    }
}

export function payByAA(debts) {
    // 从大到小排序debts，从负值开始截断，以区分谁该向谁付钱
    debts = debts.sort((a, b) => b.num - a.num);

    let [payee, payer] = truncateArrayFromNegative(debts);
    if (!payer || !payer.length) return null;

    let tracks = []; // string[], 记录每一笔偿还

    let i = 0; // payee游标
    let j = 0; // payer游标

    // while (i !== payee.length && j !== payer.length) {
    while (i < payee.length && j < payer.length) {
        let remain = payee[i].num + payer[j].num;
        if (remain >= 0) {
            tracks.push(
                `${payer[j].consumer} 应向 ${
                    payee[i].consumer
                } 支付 ￥${Math.abs(payer[j].num)}`
            );
            payee[i].num = remain;
            j++;
            remain === 0 && i++;
        } else if (remain < 0) {
            tracks.push(
                `${payer[j].consumer} 应向 ${payee[i].consumer} 支付 ￥${
                    payee[i].num
                }`
            );
            payer[j].num = remain;
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
    $(".section-aa .consume-table-wrapper").html(html);
    $('.consume-table-wrapper .btn').on('click', ev => {
        let $btn = $(ev.currentTarget);
        let $table = $('.table-wrapper');

        if ($btn.hasClass('fold')) {
            $btn.removeClass('fold');
            $btn.text('收起')
            $table.height('auto');
        }
        else {
            $btn.addClass('fold');
            $btn.text('展开')
            $table.height(400);
        }
    })
}

function renderSettlement(results) {
    let html = settlementRenderer({
        tracks: results.aaTracks,
        debts: results.debtsTrack,
        others: [
            {
                title: "总支出(现金+信用卡/线上付款)",
                num: results.totalPossess
            },
            {
                title: "总消费",
                num: results.totalConsume
            },
            {
                title: "未被记录的消费(支出-消费)",
                num: results.totalPossess - results.totalConsume
            }
        ]
    });
    $(".wrapper .settlement-wrapper").html(html);
}

function transDataToCH() {
    return data.map(item => {
        return Object.assign({}, item, {
            payerCH: PARTICIPANT_CH[item.payer],
            participantsCH: item.participants.map(p => {
                return PARTICIPANT_CH[p];
            })
        });
    });
}

function toFixed2(consumes, possesses) {
    // 取后两位小数
    Object.keys(consumes).map(key => {
        consumes[key] = +consumes[key].toFixed(2);
    });
    // 取后两位小数
    Object.keys(possesses).map(key => {
        possesses[key] = +possesses[key].toFixed(2);
    });
}
