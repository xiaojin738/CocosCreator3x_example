import { COMPARE } from "../../Scripts/Constants";
import { AlgorithmUtil } from "./AlgorithmUtil";




export class Heap {

    private _list: any[] = [];
    private _isMinHeap: boolean = true;
    private _compareFn: (a: any, b: any) => COMPARE = AlgorithmUtil.defaultCompareFn;

    /**
     * 二叉堆构造方法
     * @param isMinHeap 是否是最小堆
     * @param compareFn 比较函数
     */
    constructor(isMinHeap: boolean, compareFn: (a: any, b: any) => COMPARE = AlgorithmUtil.defaultCompareFn) {
        this._isMinHeap = isMinHeap;
        this._compareFn = compareFn;
    }


    /**
     * 交换数组中索引1和索引2中的元素
     * @param arr 目标数组
     * @param index1 索引1
     * @param index2 索引2
     */
    public swapFn(arr: any[], index1: number, index2: number): void {
        let temp: number = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }

    public getLeftIndex(index: number): number {
        return 2 * index + 1;
    }

    public getRightIndex(index: number): number {
        return 2 * index + 2;
    }

    public getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    /**
     * 二叉堆是否是空的
     * @returns 返回结果
     */
    public isEmpty(): boolean {
        return this._list.length === 0;
    }

    /**
     * 获取二叉堆的元素大小
     * @returns 返回大小
     */
    public size(): number {
        return this._list.length;
    }

    /**
     * 插入
     * @param value 插入的元素
     */
    public insert(value: any): void {
        this._list[this._list.length] = value;
        this.siftUp(this._list.length - 1);
    }

    /**
     * 上移
     * @param index 目标索引
     */
    private siftUp(index: number): void {
        let parent: number = this.getParentIndex(index);


        if (this._isMinHeap) {
            while (index > 0 && this._compareFn(this._list[index], this._list[parent]) === COMPARE.LESS_THAN) {
                this.swapFn(this._list, index, parent);
                index = parent;
                parent = this.getParentIndex(index);
            }
        }
        else {
            while (index > 0 && this._compareFn(this._list[index], this._list[parent]) === COMPARE.BIGGER_THAN) {
                this.swapFn(this._list, index, parent);
                index = parent;
                parent = this.getParentIndex(index);
            }
        }
    }

    /**
     * 下移
     * @param index 目标索引
     */
    public siftDown(index: number): void {
        let left: number = this.getLeftIndex(index);
        let right: number = this.getRightIndex(index);

        let element: number = index;

        if (this._isMinHeap) {
            if (left < this.size() && this._compareFn(this._list[element], this._list[left]) === COMPARE.BIGGER_THAN) {
                element = left;
            }
            if (right < this.size() && this._compareFn(this._list[element], this._list[right]) === COMPARE.BIGGER_THAN) {
                element = right;
            }
        }
        else {
            if (left < this.size() && this._compareFn(this._list[element], this._list[left]) === COMPARE.LESS_THAN) {
                element = left;
            }
            if (right < this.size() && this._compareFn(this._list[element], this._list[right]) === COMPARE.LESS_THAN) {
                element = right;
            }
        }
        if (element !== index) {
            this.swapFn(this._list, element, index);
            this.siftDown(element);
        }
    }

    /**
     * 获取二叉堆的最值（最小堆就是最小值，最大堆就是最大值）
     * @returns 返回最值
     */
    public findExtremeValue(): any {
        if (this.isEmpty()) {
            return undefined;
        }
        return this._list[0];
    }

    /**
     * 移除最值（最小堆就是最小值，最大堆就是最大值）
     * @returns 返回最值
     */
    public extractExtremeValue(): any {
        if (this.isEmpty()) {
            return undefined;
        }
        if (this.size() === 1) {
            return this._list.shift();
        }
        let value: number = this._list.shift();
        let last: number = this._list.pop();
        this._list.unshift(last);
        this.siftDown(0);
        return value;
    }

    public haveValue(value: any): boolean {
        let index: number = this._list.indexOf(value);
        if(index >= 0) {
            return true;
        }
        return false;
    }
}

