import { _decorator, Component, Node, PhysicsSystem2D, tween, v3 } from 'cc';
import { GameMgr } from '../../Scripts/Manager/GameMgr';
const { ccclass, property } = _decorator;

@ccclass('RateScene')
export class RateScene extends Component {

    @property(Node)
    private gold: Node = null;


    start() {
        PhysicsSystem2D.instance.enable = true;
        
        let t = tween().to(1, { position: v3(250, 200)}).to(1, { position: v3(250, 50)});
        tween(this.gold).repeatForever(t).start();
    }

    update(dt: number) {
        // console.log('dt:', dt);
    }

    /** 点击减速 */
    private onRetardClick(): void {
        GameMgr.getInstance().setGameSpeed(0.5);
    }

    private onNormalClick(): void {
        GameMgr.getInstance().setGameSpeed(1);
    }

    private onAccelerateClick(): void {
        GameMgr.getInstance().setGameSpeed(2);
    }

}

