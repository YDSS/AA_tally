import { PARTICIPANT, CURRENCY, CATEGORY, SUBCATE } from './types';

export default [
    {
        payment: 20,
        payer: PARTICIPANT.JIAN,
        currency: CURRENCY.EURO,
        date: new Date('2018-9-27'),
        desc: '电话卡充流量',
        category: CATEGORY.OTHERS,
    },
    {
        payment: 6,
        payer: PARTICIPANT.CASH,
        currency: CURRENCY.DH,
        date: new Date('2018-9-27'),
        desc: '机场高速收费',
        category: CATEGORY.TRAFFIC,
        subCate: SUBCATE.PARKING
    },
]