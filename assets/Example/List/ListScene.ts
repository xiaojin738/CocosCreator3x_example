import { _decorator, Component, director, Node, randomRangeInt, ScrollView } from 'cc';
import { ListView } from '../../Scripts/Custom/ListView';
const { ccclass, property } = _decorator;

@ccclass('ListScene')
export class ListScene extends Component {

    @property(ScrollView)
    private scrollVer: ScrollView = null;
    @property(Node)
    private RankItem: Node = null;


    @property(ScrollView)
    private scrollDataVer: ScrollView = null;
    @property(Node)
    private DataItem: Node = null;

    @property(ScrollView)
    private scrollDataHor: ScrollView = null;
    @property(Node)
    private DataItem2: Node = null;

    protected onLoad(): void {
        director.on('addDataItem', this.registerAddDataItem, this);
        director.on('deleteDataItem', this.registerDeleteDataItem, this);

        director.on('addDataItem2', this.registerAddDataItem2, this);
        director.on('deleteDataItem2', this.registerDeleteDataItem2, this);
    }


    start() {

        let dataList: number[] = [];
        for(let i = 0; i < 100; i++) {
            dataList[dataList.length] = i + 1;
        }
        this.scrollVer.getComponent(ListView).init(this.RankItem, 'RankItem', dataList);


        let dataList2: any[] = [];
        for(let i = 0; i < 101; i++) {
            let data = {
                name: `英雄${i + 1}`,
                power: randomRangeInt(1, 9999)
            };
            dataList2[dataList2.length] = data;
        }
        this.scrollDataVer.getComponent(ListView).init(this.DataItem, 'DataItem', dataList2);

        let dataList3: any[] = [];
        for(let i = 0; i < 30; i++) {
            let data = {
                name: `新英雄${i + 1}`,
                power: randomRangeInt(1, 9999)
            };
            dataList3[dataList3.length] = data;
        }
        this.scrollDataHor.getComponent(ListView).init(this.DataItem2, 'DataItem2', dataList3);
    }

    private registerAddDataItem(dataItem): void {
        this.scrollDataVer.getComponent(ListView).addItem(dataItem.index, dataItem.data);
        console.log('dataList2:', this.scrollDataVer.getComponent(ListView).getDataList());
    }

    private registerDeleteDataItem(index: number): void {
        this.scrollDataVer.getComponent(ListView).deleteItem(index);
        console.log('dataList2:', this.scrollDataVer.getComponent(ListView).getDataList());
    }

    private registerAddDataItem2(dataItem): void {
        this.scrollDataHor.getComponent(ListView).addItem(dataItem.index, dataItem.data);
        console.log('dataList3:', this.scrollDataHor.getComponent(ListView).getDataList());
    }

    private registerDeleteDataItem2(index: number): void {
        this.scrollDataHor.getComponent(ListView).deleteItem(index);
        console.log('dataList3:', this.scrollDataHor.getComponent(ListView).getDataList());
    }

    update(deltaTime: number) {
        
    }
}

