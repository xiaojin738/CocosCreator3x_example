import { math } from "cc";
import { COMPARE } from "../../Scripts/Constants";
import { AlgorithmUtil } from "./AlgorithmUtil";

/** 排序算法类 */
export class SortingAlgorithm {

    /**
     * 交换数组中索引1和索引2中的元素
     * @param arr 目标数组
     * @param index1 索引1
     * @param index2 索引2
     */
    public static swapFn(arr: any[], index1: any, index2: any): void {
        let temp: any = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }

    /**
     * JavaScript中的sort方法排序（es没有sort的具体实现，主要取决于厂商。谷歌浏览器中v8采用快速排序的变种，火狐浏览器采用归并排序）
     * @param arr 待排序数组
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static jsSort(arr: any[], compareFn = AlgorithmUtil.defaultCompareFn): any[] {
        arr.sort(compareFn);
        return arr;
    }

    /**
     * 冒泡排序
     * @param arr 待排序数组
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static bubbleSort(arr: any[], compareFn = AlgorithmUtil.defaultCompareFn): any[] {
        for (let i = 0, length = arr.length; i < length - 1; i++) {
            for (let j = 0; j < length - 1 - i; j++) {
                if (compareFn(arr[j], arr[j + 1]) === COMPARE.BIGGER_THAN) {
                    this.swapFn(arr, j, j + 1);
                }
            }
        }
        return arr;
    }

    /**
     * 选择排序
     * @param arr 待排序数组
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static selectionSort(arr: any[], compareFn = AlgorithmUtil.defaultCompareFn): any[] {
        for (let i = 0, length = arr.length; i < length; i++) {
            let indexMin: number = i;
            for (let j = i + 1; j < length; j++) {
                if (compareFn(arr[indexMin], arr[j]) === COMPARE.BIGGER_THAN) {
                    indexMin = j;
                }
            }
            if (indexMin !== i) {
                this.swapFn(arr, indexMin, i);
            }
        }
        return arr;
    }

    /**
     * 插入排序
     * @param arr 待排序数组
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static insertionSort(arr: any[], compareFn = AlgorithmUtil.defaultCompareFn): any[] {
        for (let i = 1, count = arr.length; i < count; i++) {
            let j: number = i;
            let temp: any = arr[i];
            while (j > 0 && compareFn(temp, arr[j - 1]) === COMPARE.LESS_THAN) {
                arr[j] = arr[j - 1];
                j--;
            }
            arr[j] = temp;
        }
        return arr;
    }

    /**
     * 归并排序
     * @param arr 待排序数组
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static mergeSort(arr: any[], compareFn = AlgorithmUtil.defaultCompareFn): any[] {
        if (arr.length > 1) {
            let length: number = arr.length;
            let middle: number = Math.floor(length / 2);
            let left: number[] = this.mergeSort(arr.slice(0, middle), compareFn);
            let right: number[] = this.mergeSort(arr.slice(middle, length), compareFn);
            arr = this.merge(left, right, compareFn);
        }
        return arr;
    }

    /**
     * 合并成排序后的大数组
     * @param left 排好序的左数组
     * @param right 排好序的右数组
     * @param compareFn 比较方法
     * @returns 返回合并后的数组
     */
    private static merge(left: any[], right: any[], compareFn = AlgorithmUtil.defaultCompareFn): any[] {
        let result: any[] = [];
        let i: number = 0;
        let j: number = 0;
        while (i < left.length && j < right.length) {
            result[result.length] = compareFn(left[i], right[j]) === COMPARE.LESS_THAN ? left[i++] : right[j++];
        }
        result = result.concat(i < left.length ? left.slice(i) : right.slice(j));
        return result;
    }




    /**
     * 快速排序
     * @param arr 待排序数组
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static quickSort(arr: any[], compareFn = AlgorithmUtil.defaultCompareFn): number[] {
        return this.quick(arr, 0, arr.length - 1, compareFn);
    }

    /**
     * 划分排序
     * @param arr 待排序数组
     * @param left 左指针位置
     * @param right 右指针位置
     * @param compareFn 比较方法
     * @returns 返回最终左指针位置
     */
    private static partition(arr: any[], left: number, right: number, compareFn = AlgorithmUtil.defaultCompareFn): number {
        let index: number = Math.floor((left + right) / 2);
        // 主元
        let pivot: number = arr[index];
        // 两个指针位置
        let i: number = left;
        let j: number = right;
        while (i <= j) {
            while (compareFn(arr[i], pivot) === COMPARE.LESS_THAN) {
                i++;
            }
            while (compareFn(arr[j], pivot) === COMPARE.BIGGER_THAN) {
                j--;
            }
            if (i <= j) {
                this.swapFn(arr, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    private static quick(arr: any[], left: number, right: number, compareFn = AlgorithmUtil.defaultCompareFn): number[] {
        if (arr.length > 1) {
            let index: number = this.partition(arr, left, right, compareFn);
            if (left < (index - 1)) {
                this.quick(arr, left, index - 1, compareFn);
            }
            if (index < right) {
                this.quick(arr, index, right, compareFn);
            }
        }
        return arr;
    }

    /**
     * 计数排序
     * @param arr 待排序数组
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static countingSort(arr: number[], compareFn = AlgorithmUtil.defaultCompareFn): number[] {
        if (arr.length > 1) {
            let maxValue: number = arr[0];
            let temp_arr: number[] = [];
            for (let i = 1, length = arr.length; i < length; i++) {
                let value: number = arr[i];
                if (compareFn(maxValue, value) === COMPARE.LESS_THAN) {
                    maxValue = value;
                }
                if (temp_arr[value] === undefined) {
                    temp_arr[value] = 0;
                }
                temp_arr[value] += 1;
            }

            let idx: number = 0;
            temp_arr.forEach((value: number, index: number) => {
                while (value > 0) {
                    arr[idx] = index;
                    idx += 1;
                    value -= 1;
                }
            });
        }
        return arr;
    }

    /**
     * 桶排序
     * @param arr 待排序数组
     * @param bucketSize 每个桶预计放多少个元素
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static bucketSort(arr: number[], bucketSize: number = 5, compareFn = AlgorithmUtil.defaultCompareFn): number[] {
        if (arr.length > 1) {
            let minValue: number = arr[0];
            let maxValue: number = arr[0];
            for (let i = 1, length = arr.length; i < length; i++) {
                if (compareFn(arr[i], minValue) === COMPARE.LESS_THAN) {
                    minValue = arr[i];
                }
                else if (compareFn(arr[i], maxValue) === COMPARE.BIGGER_THAN) {
                    maxValue = arr[i];
                }
            }
            let buckets: number[][] = [];
            // 桶数量
            let bucketCount: number = Math.floor((maxValue - minValue) / bucketSize) + 1;
            for (let i = 0; i < bucketCount; i++) {
                buckets[i] = [];
            }
            for (let i = 0, length = arr.length; i < length; i++) {
                let index: number = Math.floor((arr[i] - minValue) / bucketSize);
                buckets[index].push(arr[i]);
            }
            // 对每个桶里面的元素进行排序
            arr = [];
            for (let i = 0; i < bucketCount; i++) {
                buckets[i] = this.insertionSort(buckets[i]);
                arr.push(...buckets[i]);
            }
        }
        return arr;
    }

    /**
     * 堆排序（不是好的排序算法，如果数组没有排好序，可能会得到不一样的结果）
     * @param arr 待排序数组
     * @param compareFn 比较方法
     * @returns 返回排序结束的数组
     */
    public static heapSort(arr: any[], compareFn = AlgorithmUtil.defaultCompareFn): any[] {
        let heapSize: number = arr.length;
        this.buildHeap(arr, compareFn);
        while (heapSize > 1) {
            this.swapFn(arr, 0, --heapSize);
            this.heapify(arr, 0, heapSize, compareFn);
        }
        return arr;
    }

    /**
     * 根据数组创建二叉堆
     * @param list 数组
     * @param compareFn 比较函数
     */
    public static buildHeap(list: any[], compareFn = AlgorithmUtil.defaultCompareFn): void {
        let count: number = Math.floor(list.length / 2);
        for (let i = count; i >= 0; i--) {
            this.heapify(list, i, list.length, compareFn);
        }
    }

    private static showHeap(list: number[]): void {
        let content: string = '';
        for (let i = 0, length = list.length; i < length; i++) {
            let r: number = ~~Math.log2(i + 1);
            if (Math.pow(2, r) === (i + 1)) {
                content = `${content}\n${list[i]}`
            }
            else {
                content = `${content},${list[i]}`;
            }
        }
        console.log('content:', content);
    }

    private static heapify(array: any[], index: number, length: number, compareFn = AlgorithmUtil.defaultCompareFn): void {
        let left: number = 2 * index + 1;
        let right: number = 2 * index + 2;
        let element: number = index;
        if (left < length && compareFn(array[element], array[left]) === COMPARE.LESS_THAN) {
            element = left;
        }
        if (right < length && compareFn(array[element], array[right]) === COMPARE.LESS_THAN) {
            element = right;
        }
        if (element !== index) {
            this.swapFn(array, element, index);
            this.heapify(array, element, length, compareFn);
        }
    }
}