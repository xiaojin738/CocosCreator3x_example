import { _decorator, color, Color, Component, find, Node, sp } from 'cc';
import { AssetsMgr } from './Manager/AssetsMgr';
import { ProfilerUtils } from './Utils/ProfilerUtils';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    start() {
        ProfilerUtils.setStyle(color(0, 0, 255, 255), 23);
    }

    update(deltaTime: number) {
        
    }

}

