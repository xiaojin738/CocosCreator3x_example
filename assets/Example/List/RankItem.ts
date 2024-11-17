import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RankItem')
export class RankItem extends Component {

    private _data: any = -1;

    @property(Label)
    private lbl_no: Label = null;

    start() {

    }

    public setData(index: number, data): void {
        this._data = data;

        this.lbl_no.string = `第${data}名`;
    }

    update(deltaTime: number) {
        
    }
}

