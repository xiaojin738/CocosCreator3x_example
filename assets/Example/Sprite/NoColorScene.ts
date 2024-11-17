import { _decorator, Component, Director, director, Node, UI } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NoColorScene')
export class NoColorScene extends Component {

    protected onLoad(): void {
        // let firstTime: number = (new Date()).getTime();
        // director.on(Director.EVENT_BEFORE_UPDATE, () => {
        //     let time: number = (new Date()).getTime();
        //     console.log('时间差1:', (time - firstTime));
        // });

        // director.on(Director.EVENT_AFTER_UPDATE, () => {
        //     let time: number = (new Date()).getTime();
        //     console.log('时间差2:', (time - firstTime));
        // });

        // director.on(Director.EVENT_BEFORE_DRAW, () => {
        //     let time: number = (new Date()).getTime();
        //     console.log('时间31:', (time - firstTime));
        // });

        // director.on(Director.EVENT_AFTER_DRAW, () => {
        //     let time: number = (new Date()).getTime();
        //     console.log('时间差4:', (time - firstTime));
        // });
    }
    start() {
    }

    update(deltaTime: number) {
        
    }
}

