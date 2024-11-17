import { _decorator, Color, Component, EventTouch, Label, Node, Rect, Sprite, UITransform, v3, Vec2, Vec3 } from 'cc';
import RenderUtils from '../../Scripts/Utils/RenderUtils';

const { ccclass, property } = _decorator;

@ccclass('RenderScene')
export class RenderScene extends Component {

    @property(Node)
    private nodeTextures: Node = null;

    @property(Node)
    private nodeShowColor: Node = null;

    @property(Label)
    private lbl_showRGBA: Label = null;

    @property(Label)
    private lbl_showRGBA2: Label = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }
    start() {

    }

    private onTouchStart(event: EventTouch): void {
        let uiPos: Vec2 = event.getUILocation();
        for (let i = this.nodeTextures.children.length - 1; i >= 0; i--) {
            let child: Node = this.nodeTextures.children[i];
            let wBoundingBox: Rect = child.getComponent(UITransform).getBoundingBoxToWorld();
            if (wBoundingBox.contains(uiPos)) {
                let wPos: Vec3 = v3(uiPos.x, uiPos.y, 0);
                let pos: Vec3 = child.getComponent(UITransform).convertToNodeSpaceAR(wPos);

                let color: Color = RenderUtils.readColor(child, pos);
                this.nodeShowColor.getComponent(Sprite).color = color;
                // this.lbl_showRGBA.color = color;
                this.lbl_showRGBA.string = `R:${color.r}, G:${color.g}, B:${color.b}, A:${color.a}`;
                // this.lbl_showRGBA2.color = color;
                this.lbl_showRGBA2.string = `#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}${color.a.toString(16)}`;
                break;
            }
        }
    }

    update(deltaTime: number) {

    }
}

