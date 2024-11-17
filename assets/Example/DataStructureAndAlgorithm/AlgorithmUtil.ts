import { COMPARE } from "../../Scripts/Constants";

export class AlgorithmUtil {

    /**
     * 默认比较函数
     * @param a 元素a
     * @param b 元素b
     * @returns 返回比较结果
     */
    public static defaultCompareFn(a: number, b: number): COMPARE {
        if(a > b) {
            return COMPARE.BIGGER_THAN;
        }
        else if(a < b) {
            return COMPARE.LESS_THAN;
        }
        else {
            return COMPARE.EQUAL;
        }
    }
}

