import { PARTICIPANT, CURRENCY, CATEGORY, SUBCATE, PARTICIPANT_CH } from './types';

export default [
    {
        payment: 20,
        payer: PARTICIPANT.JIAN,
        currency: CURRENCY.EURO,
        date: '2018-09-27',
        desc: '电话卡充流量',
        category: CATEGORY.OTHERS,
        participants: [PARTICIPANT.YANG, PARTICIPANT.JIAN, PARTICIPANT.PC, PARTICIPANT.MAY],
    },
    {
        payment: 6,
        payer: PARTICIPANT.CASH,
        currency: CURRENCY.DH,
        date: '2018-09-27',
        desc: '机场高速收费',
        category: CATEGORY.TRAFFIC,
        subCate: SUBCATE.PARKING,
        participants: [PARTICIPANT.YANG, PARTICIPANT.JIAN, PARTICIPANT.PC, PARTICIPANT.MAY],
    },
]