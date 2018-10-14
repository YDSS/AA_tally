import data from './consumeData';
import { CATEGORY, SUBCATE } from './types';
import { exchangeToRMB } from './utils';

export default function init() {
    renderCategoryChart();
    renderDailyConsumeChart();
}

function renderCategoryChart() {
    let $container = $('.section-chart .category-chart');
    let pieChart = echarts.init($container.get(0));
    pieChart.setOption(getCategoryOption());
}

function getCategoryOption() {
    let { categoryData, subCateData } = classifyCategoryData();

    return {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:[
                CATEGORY.HOTEL,
                CATEGORY.DIET,
                CATEGORY.TRAFFIC,
                CATEGORY.OTHERS,
                SUBCATE.RIAD,
                SUBCATE.AP,
                SUBCATE.HOTEL,
                SUBCATE.TENT,
                SUBCATE.CHFOOD,
                SUBCATE.MOFOOD,
                SUBCATE.FRFOOD,
                SUBCATE.SPFOOD,
                SUBCATE.PARKING,
                SUBCATE.OIL,
                SUBCATE.RENTAL,
                SUBCATE.TAXI,
                SUBCATE.TIP
            ]
        },
        series: [
            {
                name:'开销大类',
                type:'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
    
                label: {
                    normal: {
                        position: 'inner'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:categoryData
            },
            {
                name:'开销细分',
                type:'pie',
                radius: ['40%', '55%'],
                label: {
                    normal: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        // shadowBlur:3,
                        // shadowOffsetX: 2,
                        // shadowOffsetY: 2,
                        // shadowColor: '#999',
                        // padding: [0, 7],
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            // abg: {
                            //     backgroundColor: '#333',
                            //     width: '100%',
                            //     align: 'right',
                            //     height: 22,
                            //     borderRadius: [4, 4, 0, 0]
                            // },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                data: subCateData
            }
        ]
    };
}

function classifyCategoryData() {
    let categoryData = [
        {
            name: CATEGORY.HOTEL,
            value: 0,
        },
        {
            name: CATEGORY.DIET,
            value: 0,
        },
        {
            name: CATEGORY.TRAFFIC,
            value: 0,
        },
        {
            name: CATEGORY.OTHERS,
            value: 0,
        },
    ];
    let categoryIndex = {
        [CATEGORY.HOTEL]: 0,
        [CATEGORY.DIET]: 1,
        [CATEGORY.TRAFFIC]: 2,
        [CATEGORY.OTHERS]: 3,
    }
    let subCateData = [
        {
            name: SUBCATE.RIAD,
            value: 0,
        },
        {
            name: SUBCATE.AP,
            value: 0,
        },
        {
            name: SUBCATE.HOTEL,
            value: 0,
        },
        {
            name: SUBCATE.TENT,
            value: 0,
        },
        {
            name: SUBCATE.CHFOOD,
            value: 0,
        },
        {
            name: SUBCATE.MOFOOD,
            value: 0,
        },
        {
            name: SUBCATE.FRFOOD,
            value: 0,
        },
        {
            name: SUBCATE.SPFOOD,
            value: 0,
        },
        {
            name: SUBCATE.WEFOOD,
            value: 0,
        },
        {
            name: SUBCATE.PARKING,
            value: 0,
        },
        {
            name: SUBCATE.OIL,
            value: 0,
        },
        {
            name: SUBCATE.RENTAL,
            value: 0,
        },
        {
            name: SUBCATE.TAXI,
            value: 0,
        },
        {
            name: SUBCATE.TIP,
            value: 0,
        },
    ]
    let subCateIndex = {
        [SUBCATE.RIAD]: 0,
        [SUBCATE.AP]: 1,
        [SUBCATE.HOTEL]: 2,
        [SUBCATE.TENT]: 3,
        [SUBCATE.CHFOOD]: 4,
        [SUBCATE.MOFOOD]: 5,
        [SUBCATE.FRFOOD]: 6,
        [SUBCATE.SPFOOD]: 7,
        [SUBCATE.WEFOOD]: 8,
        [SUBCATE.PARKING]: 9,
        [SUBCATE.OIL]: 10,
        [SUBCATE.RENTAL]: 11,
        [SUBCATE.TAXI]: 12,
        [SUBCATE.TIP]: 13,
    }

    data.map(item => {
        let category = categoryData[categoryIndex[item.category]];
        category.value += exchangeToRMB({
            value: item.payment,
            currency: item.currency
        });

        if (item.subCate) {
            let subCate = subCateData[subCateIndex[item.subCate]];
            subCate.value += exchangeToRMB({
                value: item.payment,
                currency: item.currency
            });
        }
    });

    return {
        categoryData,
        subCateData
    }
}

function renderDailyConsumeChart() {
    let $container = $('.section-chart .daily-chart');
    let dailyChart = echarts.init($container.get(0));
    dailyChart.setOption(getDailyOption());
}

function getDailyOption() {
    let categoryData = classifyDailyData();

    return {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: [CATEGORY.HOTEL, CATEGORY.DIET, CATEGORY.TRAFFIC, CATEGORY.OTHERS]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis:  {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: ['2018-09-26', '2018-09-27', '2018-09-28', '2018-09-29', '2018-09-30', '2018-10-01', '2018-10-02', '2018-10-03', '2018-10-04', '2018-10-05', '2018-10-06', '2018-10-07',]
        },
        series: [
            {
                name: CATEGORY.HOTEL,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: categoryData[CATEGORY.HOTEL]
            },
            {
                name: CATEGORY.DIET,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: categoryData[CATEGORY.DIET]
            },
            {
                name: CATEGORY.TRAFFIC,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: categoryData[CATEGORY.TRAFFIC]
            },
            {
                name: CATEGORY.OTHERS,
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: categoryData[CATEGORY.OTHERS]
            },
        ]
    };
}

function classifyDailyData() {
    let dateIndex = {
        '2018-09-26': 0,
        '2018-09-27': 1,
        '2018-09-28': 2,
        '2018-09-29': 3,
        '2018-09-30': 4,
        '2018-10-01': 5,
        '2018-10-02': 6,
        '2018-10-03': 7,
        '2018-10-04': 8,
        '2018-10-05': 9,
        '2018-10-06': 10,
        '2018-10-07': 11,
    };
    let categoryData = {
        [CATEGORY.HOTEL]: [],
        [CATEGORY.DIET]: [],
        [CATEGORY.TRAFFIC]: [],
        [CATEGORY.OTHERS]: [],
    };
    // 初始化category data
    Object.keys(categoryData).map(key => {
        let category = categoryData[key];
        for (let i = 0; i < 12; i++) {
            category[i] = 0; 
        }
    });

    data.map(item => {
        let categoryByDate = categoryData[item.category];
        let indexByDate = dateIndex[item.date];
        categoryByDate[indexByDate] += exchangeToRMB({
            value: item.payment,
            currency: item.currency
        });
    });
    return categoryData;
}
