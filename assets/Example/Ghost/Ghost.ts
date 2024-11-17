import { _decorator, color, Component, Node, Sprite, SpriteFrame, tween, UIOpacity, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ghost')
export class Ghost extends Component {

    protected ghostList: Node[] = [];

    start() {
        for(let i = 0; i < 5; i++) {
            let node: Node = new Node(`ghost${i + 1}`);
            node.setParent(this.node.getParent());
            node.setSiblingIndex(0);
            node.setPosition(this.node.getPosition());
            node.setScale(this.node.getScale());
            
            let sp = node.addComponent(Sprite);
            node.getComponent(UITransform).width = this.node.getComponent(UITransform).width;
            node.getComponent(UITransform).height = this.node.getComponent(UITransform).height;
            sp.spriteFrame = this.node.getComponent(Sprite).spriteFrame;
            this.ghostList[this.ghostList.length] = node;
            sp.color = color(255, 255, 255, 255 / (i + 1.5));
        }

        this.schedule(this.updateTime, 0.1);
    }

    update(dt: number) {
        
    }

    protected updateTime(dt: number): void {
        for(let i = 0, length = this.ghostList.length; i < length; i++) {
            let node: Node = this.ghostList[i];
            tween(node).stop();
            tween(node).to(i * 0.05 + 0.02, { position: this.node.getPosition() }).start();
        }
    }
}

