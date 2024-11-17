import { _decorator, Color, Component, EventTouch, Graphics, instantiate, isValid, Label, Line, math, Node, Prefab, randomRangeInt, Sprite, UITransform, v3, Vec2, Vec3 } from 'cc';
import { Quadtree } from './src/Quadtree';
import { Rectangle } from './src/Rectangle';
const { ccclass, property } = _decorator;

@ccclass('DynamicQuatree')
export class DynamicQuatree extends Component {

    @property(Node)
    private quadTreeNode: Node = null;

    @property(Graphics)
    private graphics: Graphics = null;

    @property(Node)
    private nodeParent: Node = null;

    @property(Prefab)
    private rectPrefab: Prefab = null;


    /** 四叉树对象 */
    private myQuadtree: Quadtree<Rectangle> = null;

    /** 添加到四叉树中的所有方块数据 */
    private myObjects: Rectangle<any>[] = [];

    /** 需要单独操作的矩形数据 */
    private curObject: Rectangle<any> = null;
    /** 需要段度操作的矩形节点 */
    private curRectNode: Node = null;

    private addId: number = 0;


    protected onLoad(): void {
        this.quadTreeNode.on(Node.EventType.TOUCH_MOVE, this.onAuadTreeTouchMove, this);
    }



    start() {
        // 创建四叉树
        this.myQuadtree = new Quadtree({
            x: 0,
            y: 0,
            width: 1200,
            height: 560
        });

        this.drawQuadTree(this.myQuadtree);

        this.myObjects = [];

        this.curObject = new Rectangle({
            x: 0,
            y: 0,
            width: 30,
            height: 30,
            data: {
                node: null
            }
        });
        this.curRectNode = this.createRectNode(this.curObject);
        this.curObject.data.node = this.curRectNode;


        for (let i = 0; i < 50; i++) {
            this.createRectangle();
        }
    }

    update(dt: number) {
        this.loop(dt);
    }

    private loop(dt: number): void {
        let bounds = this.myQuadtree.bounds;
        this.myQuadtree.clear();
        this.clearGraphic();
        this.myObjects.forEach((v) => {
            if (v && v.data) {
                let node: Node = v.data.node;
                let pos: Vec3 = node.getPosition();
                pos.x += (v.data.vx * dt);
                pos.y += (v.data.vy * dt);
                node.setPosition(pos);

                v.x = pos.x;
                v.y = pos.y;

                node.getComponent(Sprite).color = Color.WHITE;

                if (pos.x < 0) {
                    v.data.vx = randomRangeInt(20, 80);
                }
                else if (pos.x > bounds.width) {
                    v.data.vx = -randomRangeInt(20, 80);
                }

                if (pos.y < 0) {
                    v.data.vy = randomRangeInt(20, 80);
                }
                else if (pos.y > bounds.height) {
                    v.data.vy = -randomRangeInt(20, 80);
                }

                this.myQuadtree.insert(v);
            }
        });

        let rects: Rectangle<any>[] = this.myQuadtree.retrieve(this.curObject);
        rects.forEach((v) => {
            let node: Node = v.data.node;
            node.getComponent(Sprite).color = Color.GREEN;
        });
        this.drawQuadTree(this.myQuadtree);
    }


    private onAuadTreeTouchMove(event: EventTouch): void {
        let wPos2: Vec2 = event.getUILocation();
        let pos: Vec3 = this.nodeParent.getComponent(UITransform).convertToNodeSpaceAR(v3(wPos2.x, wPos2.y, 0));
        this.curObject.x = pos.x;
        this.curObject.y = pos.y;

        this.curRectNode.setPosition(pos);

        this.myObjects.forEach((v) => {
            let node: Node = v.data.node;
            node.getComponent(Sprite).color = Color.WHITE;
        });

        let rects: Rectangle<any>[] = this.myQuadtree.retrieve(this.curObject);
        rects.forEach((v) => {
            let node: Node = v.data.node;
            node.getComponent(Sprite).color = Color.GREEN;
        });
    }

    /**
     * 创建矩形数据和节点
     * @param rect 矩形数据
     */
    private createRectangle(rect?: any) {
        let bounds = this.myQuadtree.bounds;
        rect = rect || new Rectangle({
            x: randomRangeInt(0, bounds.width - 40),
            y: randomRangeInt(0, bounds.height - 40),
            width: randomRangeInt(20, 40),
            height: randomRangeInt(20, 40),
            data: {
                node: null,
                vx: 0,
                vy: 0
            }
        });
        rect.data.vx = (Math.random() >= 0.5 ? 1 : -1) * randomRangeInt(20, 80);
        rect.data.vy = (Math.random() >= 0.5 ? 1 : -1) * randomRangeInt(20, 80);

        let node: Node = this.createRectNode(rect);
        rect.data.node = node;

        this.myObjects[this.myObjects.length] = rect;
        this.myQuadtree.insert(rect);


        this.drawQuadTree(this.myQuadtree);
    }

    /**
     * 根据矩形数据创建节点
     * @param rect 矩形数据
     * @returns 返回节点
     */
    private createRectNode(rect: Rectangle<any>): Node {
        let node: Node = instantiate(this.rectPrefab);
        let pos: Vec3 = v3(rect.x, rect.y, 0);
        node.setParent(this.nodeParent);
        node.setPosition(pos);
        let uiTransform: UITransform = node.getComponent(UITransform);
        uiTransform.width = rect.width;
        uiTransform.height = rect.height;
        this.addId++;
        node.getChildByName('lbl_content').getComponent(Label).string = `${this.addId}`;
        return node;
    }

    /**
     * 绘制四叉树包围盒
     * @param node 四叉树对象
     */
    private drawQuadTree(node: Quadtree<Rectangle>): void {
        if (!this.myQuadtree) {
            return;
        }
        let bounds = node.bounds;
        if (node.nodes.length === 0) {
            this.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height, node.level);
        }
        else {
            for (let i = 0, count = node.nodes.length; i < count; i++) {
                this.drawQuadTree(node.nodes[i]);
            }
        }
    }

    private strokeRect(x: number, y: number, w: number, h: number, level: number): void {
        this.graphics.lineWidth = 2 + level;
        this.graphics.strokeColor = level < 2 ? Color.RED : Color.GREEN;
        this.graphics.rect(x, y, w, h);
        this.graphics.stroke();
    }

    private clearGraphic(): void {
        this.graphics.clear();
    }

    protected onDestroy(): void {
        this.quadTreeNode.off(Node.EventType.TOUCH_MOVE, this.onAuadTreeTouchMove, this);
    }
}

