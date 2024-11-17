import { _decorator, Component, Node } from 'cc';
import Utils from '../../Scripts/Utils/Utils';
import { SortingAlgorithm } from './SortingAlgorithm';
import { Heap } from './Heap';
import { COMPARE } from '../../Scripts/Constants';
import { AlgorithmUtil } from './AlgorithmUtil';
const { ccclass, property } = _decorator;

@ccclass('SortScene')
export class SortScene extends Component {


    start() {
        this.sortingAlgorithm();
        // this.sortingAlgorithm2();
    }

    update(deltaTime: number) {
        
    }


    protected showHeap(): void {
        let list: number[] = [];
        let heap: Heap = new Heap(true);
        for(let i = 1; i <= 100; i++) {
            list[list.length] = i;
        }
        list.sort((a, b) => {
            return Math.random() - 0.5;
        });
        console.log('list:', list);
        for(let i = 0, length = list.length; i < length; i++) {
            heap.insert(list[i]);
        }
        console.log('获取二叉堆最小值：', heap.findExtremeValue());
        while(heap.size() > 0) {
            console.log('输出值：', heap.extractExtremeValue());
        }
    }

    /**
     * 排序算法
     */
    protected sortingAlgorithm(): void {

        let list: number[] = [];
        for(let i = 0; i < 50000; i++) {
            list[list.length] = i + 1;
        }

        // list.sort((a, b) => {
        //     return Math.random() - 0.5;
        // });

        SortingAlgorithm.swapFn(list, 0, list.length - 1);
        SortingAlgorithm.swapFn(list, 3, 10000);
        console.log('list:', list);

        let list0: number[] = Utils.deepCopy(list);
        let list1: number[] = Utils.deepCopy(list);
        let list2: number[] = Utils.deepCopy(list);
        let list3: number[] = Utils.deepCopy(list);
        let list4: number[] = Utils.deepCopy(list);
        let list5: number[] = Utils.deepCopy(list);

        let list6: number[] = Utils.deepCopy(list);
        let list7: number[] = Utils.deepCopy(list);
        let list8: number[] = Utils.deepCopy(list);

        let list9: number[] = Utils.deepCopy(list);


        // JavaScript的sort方法排序
        let startTime0: number = Date.now();
        list0 = SortingAlgorithm.jsSort(list0);
        let endTime0: number = Date.now();
        let deltaTime0: number = endTime0 - startTime0;
        console.log(`【js的sort方法排序】算法的时间：${deltaTime0}ms`, list0);

        // 冒泡排序
        let startTime1: number = Date.now();
        list1 = SortingAlgorithm.bubbleSort(list1);
        let endTime1: number = Date.now();
        let deltaTime1: number = endTime1 - startTime1;
        console.log(`【冒泡排序】算法的时间：${deltaTime1}ms`, list1);

        // 选择排序
        let startTime2: number = Date.now();
        list2 = SortingAlgorithm.selectionSort(list2);
        let endTime2: number = Date.now();
        let deltaTime2: number = endTime2 - startTime2;
        console.log(`【选择排序】算法的时间：${deltaTime2}ms`, list2);

        // 插入排序
        let startTime3: number = Date.now();
        list3 = SortingAlgorithm.insertionSort(list3);
        let endTime3: number = Date.now();
        let deltaTime3: number = endTime3 - startTime3;
        console.log(`【插入排序】算法的时间：${deltaTime3}ms`, list3);

        // 归并排序
        let startTime4: number = Date.now();
        list4 = SortingAlgorithm.mergeSort(list4);
        let endTime4: number = Date.now();
        let deltaTime4: number = endTime4 - startTime4;
        console.log(`【归并排序】算法的时间：${deltaTime4}ms`, list4);

        // 快速排序
        let startTime5: number = Date.now();
        list5 = SortingAlgorithm.quickSort(list5);
        let endTime5: number = Date.now();
        let deltaTime5: number = endTime5 - startTime5;
        console.log(`【快速排序】算法的时间：${deltaTime5}ms`, list5);

        // 计数排序
        let startTime6: number = Date.now();
        list6 = SortingAlgorithm.countingSort(list6);
        let endTime6: number = Date.now();
        let deltaTime6: number = endTime6 - startTime6;
        console.log(`【计数排序】算法的时间：${deltaTime6}ms`, list5);

        // 桶排序
        let startTime7: number = Date.now();
        list7 = SortingAlgorithm.bucketSort(list7);
        let endTime7: number = Date.now();
        let deltaTime7: number = endTime7 - startTime7;
        console.log(`【桶排序】算法的时间：${deltaTime7}ms`, list7);


        // 堆排序
        let startTime9: number = Date.now();
        list9 = SortingAlgorithm.heapSort(list9);
        let endTime9: number = Date.now();
        let deltaTime9: number = endTime9 - startTime9;
        console.log(`【堆排序】算法的时间：${deltaTime9}ms`, list9);

    }

    protected sortingAlgorithm2(): void {
        let compareFn = (a: any, b: any) => {
            if(a.value > b.value) {
                return COMPARE.BIGGER_THAN;
            }
            else if(a.value < b.value) {
                return COMPARE.LESS_THAN;
            }
            else {
                return COMPARE.EQUAL;
            }
        }

        let list: any[] = [];
        for(let i = 0; i < 50000; i++) {
            list[list.length] = {
                value: i + 1
            };
        }
        list.sort((a, b) => {
            return Math.random() - 0.5;
        });
        // SortingAlgorithm.swapFn(list, 2, 30000);
        // SortingAlgorithm.swapFn(list, 20, 30001);
        // SortingAlgorithm.swapFn(list, 111, 301);

        console.log('list:', list);

        let list0: any[] = Utils.deepCopy(list);
        let list1: any[] = Utils.deepCopy(list);
        let list2: any[] = Utils.deepCopy(list);
        let list3: any[] = Utils.deepCopy(list);
        let list4: any[] = Utils.deepCopy(list);
        let list5: any[] = Utils.deepCopy(list);

        let list6: any[] = Utils.deepCopy(list);
        let list7: any[] = Utils.deepCopy(list);
        let list8: any[] = Utils.deepCopy(list);

        let list9: any[] = Utils.deepCopy(list);


        // JavaScript的sort方法排序
        let startTime0: number = Date.now();
        list0 = SortingAlgorithm.jsSort(list0, compareFn);
        let endTime0: number = Date.now();
        let deltaTime0: number = endTime0 - startTime0;
        console.log(`【js的sort方法排序】算法的时间：${deltaTime0}ms`, list0);

        // 冒泡排序
        let startTime1: number = Date.now();
        list1 = SortingAlgorithm.bubbleSort(list1, compareFn);
        let endTime1: number = Date.now();
        let deltaTime1: number = endTime1 - startTime1;
        console.log(`【冒泡排序】算法的时间：${deltaTime1}ms`, list1);

        // 选择排序
        let startTime2: number = Date.now();
        list2 = SortingAlgorithm.selectionSort(list2, compareFn);
        let endTime2: number = Date.now();
        let deltaTime2: number = endTime2 - startTime2;
        console.log(`【选择排序】算法的时间：${deltaTime2}ms`, list2);

        // 插入排序
        let startTime3: number = Date.now();
        list3 = SortingAlgorithm.insertionSort(list3, compareFn);
        let endTime3: number = Date.now();
        let deltaTime3: number = endTime3 - startTime3;
        console.log(`【插入排序】算法的时间：${deltaTime3}ms`, list3);

        // 归并排序
        let startTime4: number = Date.now();
        list4 = SortingAlgorithm.mergeSort(list4, compareFn);
        let endTime4: number = Date.now();
        let deltaTime4: number = endTime4 - startTime4;
        console.log(`【归并排序】算法的时间：${deltaTime4}ms`, list4);

        // 快速排序
        let startTime5: number = Date.now();
        list5 = SortingAlgorithm.quickSort(list5, compareFn);
        let endTime5: number = Date.now();
        let deltaTime5: number = endTime5 - startTime5;
        console.log(`【快速排序】算法的时间：${deltaTime5}ms`, list5);


        // 堆排序
        let startTime9: number = Date.now();
        list9 = SortingAlgorithm.heapSort(list9, compareFn);
        let endTime9: number = Date.now();
        let deltaTime9: number = endTime9 - startTime9;
        console.log(`【堆排序】算法的时间：${deltaTime9}ms`, list9);
    }
}

