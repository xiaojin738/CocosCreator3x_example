import { _decorator, Component, EventTouch, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GhostScene')
export class GhostScene extends Component {

    @property(Node)
    private nodeRole: Node = null;

    protected onLoad(): void {
        this.nodeRole.on(Node.EventType.TOUCH_MOVE, this.onTouchMoveCallback, this);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }

    protected onTouchMoveCallback(event: EventTouch): void {
        let delta: Vec2 = event.getUIDelta();
        let pos: Vec3 = this.nodeRole.getPosition();
        pos.x += delta.x;
        pos.y += delta.y;
        this.nodeRole.setPosition(pos);
    }
}

