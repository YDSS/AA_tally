import calculateAA, { payByAA } from './js/aa';

let test = [100, 50, 10, -80, -60, -10, -10];
payByAA(test).map(item => {
    console.log(item);
})