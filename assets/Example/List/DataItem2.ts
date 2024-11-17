import { _decorator, Component, director, Label, Node, randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataItem2')
export class DataItem2 extends Component {

    private _index: number = -1;
    private _data: any = null;

    @property(Label)
    private lbl_name: Label = null;

    @property(Label)
    private lbl_power: Label = null;

    @property(Node)
    private btn_add: Node = null;

    @property(Node)
    private btn_delete: Node = null;

    protected onLoad(): void {
        this.btn_add.on('click', this.onAddClick, this);
        this.btn_delete.on('click', this.onDeleteClick, this);
    }

    start() {

    }

    public setData(index: number, data): void {
        this._index = index;
        this._data = data;

        this.lbl_name.string = data.name;
        this.lbl_power.string = `战斗力：${data.power}`;
    }

    private onAddClick(): void {
        console.log('onAddClick');
        director.emit('addDataItem2', {
            index: this._index + 1,
            data: {
                name: `${this._data.name}+`,
                power: randomRangeInt(100, 110)
            }
        });
    }

    private onDeleteClick(): void {
        console.log('onDeleteClick');
        director.emit('deleteDataItem2', this._index);
    }

    update(deltaTime: number) {
        
    }
}

