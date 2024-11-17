import { _decorator, Camera, Canvas, Color, color, Component, EventTouch, Graphics, Node, sys, Toggle, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { AStar } from './AStar';
const { ccclass, property } = _decorator;



@ccclass('AStarScene')
export class AStarScene extends Component {

    @property(Graphics)
    protected myGraphics: Graphics = null;
    @property(Toggle)
    protected toggle_openAllDir: Toggle = null;


    /** 每个格子的尺寸宽度 */
    public gridWidth: number = 10;

    protected initPosX: number = 0;
    protected initPosY: number = 0;

    protected startPoint: Vec2 = v2(0, 0);
    protected destPoint: Vec2 = v2(0, 0);

    /** 是否开放所有方向？除了上下左右，还包括左上、左下、右上、右下 */
    protected isAllDir: boolean = false;


    protected _aStar: AStar = null;

    /** 测试用的 */
    protected wallList: number[][] = [];


    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.toggle_openAllDir.node.on('toggle', this.onToggleChange, this);

        this.isAllDir = this.toggle_openAllDir.isChecked;
    }

    start() {
        let width: number = 1280;
        let height: number = 720;

        this.showAllGrids(this.gridWidth, this.gridWidth, width, height);

        this.startPoint = v2(8, 3);
        this.destPoint = v2(18, 55);

        this.showStartPoint(this.startPoint.x, this.startPoint.y);
        this.showDestPoint(this.destPoint.x, this.destPoint.y);

        this._aStar = new AStar(this.gridWidth, this.gridWidth, width, height);

        // this.wallList = [];
        // this.wallList = JSON.parse(sys.localStorage.getItem('wallList'));
        // this.scheduleOnce(() => {
        //     for(let i = 0, length = this.wallList.length; i < length; i++) {
        //         let [row, col] = this.wallList[i];
        //         this.showObstaclePoint(row, col);
        //         this._aStar.setGrid(row, col, true);
        //     }
        //     this.scheduleOnce(() => {
        //         this.onStartAStarClick();
        //     });
        // });
    }

    /**
     * 显示所有单元格
     */
    protected showAllGrids(gridWidth: number, gridHeight: number, width: number, height: number): void {
        this.myGraphics.clear();
        this.myGraphics.lineWidth = 3;

        let totalRow: number = Math.ceil(height / gridHeight);
        let totalCol: number = Math.ceil(width / gridWidth);
        let initPosX: number = -width / 2;
        let initPosY: number = -height / 2;

        this.initPosX = initPosX;
        this.initPosY = initPosY;

        for (let i = 0; i < totalRow; i++) {
            let posY: number = initPosY + i * this.gridWidth;
            for (let j = 0; j < totalCol; j++) {
                let posX: number = initPosX + j * this.gridWidth;
                this.myGraphics.rect(posX, posY, this.gridWidth, this.gridWidth);
                this.myGraphics.stroke();
            }
        }
    }

    /**
     * 显示起始点位置
     * @param row 行
     * @param col 列
     */
    protected showStartPoint(row: number, col: number): void {
        this.drawGridColor(row, col, new Color(0, 255, 0, 255));
    }

    /**
     * 显示终点位置
     * @param row 行
     * @param col 列
     */
    protected showDestPoint(row: number, col: number): void {
        this.drawGridColor(row, col, new Color(255, 0, 0, 255));
    }

    /**
     * 显示指定格子为障碍物
     * @param row 行
     * @param col 列
     * @returns 返回结果
     */
    protected showObstaclePoint(row: number, col: number): void {
        this.drawGridColor(row, col, new Color(114, 114, 114, 255));
        this.wallList[this.wallList.length] = [row, col];
    }

    /**
     * 只指定行列的格子填充颜色
     * @param row 指定行
     * @param col 指定列
     * @param color 颜色对象
     */
    protected drawGridColor(row: number, col: number, color: Color): void {
        let posX: number = this.initPosX + col * this.gridWidth;
        let posY: number = this.initPosY + row * this.gridWidth;
        this.myGraphics.rect(posX, posY, this.gridWidth, this.gridWidth);
        this.myGraphics.fillColor = color;
        this.myGraphics.fill();
    }

    protected onTouchStart(event: EventTouch): void {
        let wPos: Vec2 = event.getUILocation();
        let pos: Vec3 = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(wPos.x, wPos.y, 0));

        let col: number = ~~((pos.x - this.initPosX) / this.gridWidth);
        let row: number = ~~((pos.y - this.initPosY) / this.gridWidth);

        this.showObstaclePoint(row, col);
        this._aStar.setGrid(row, col, true);
    }

    protected onTouchMove(event: EventTouch): void {
        let wPos: Vec2 = event.getUILocation();
        let pos: Vec3 = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(wPos.x, wPos.y, 0));

        let col: number = ~~((pos.x - this.initPosX) / this.gridWidth);
        let row: number = ~~((pos.y - this.initPosY) / this.gridWidth);

        this.showObstaclePoint(row, col);
        this._aStar.setGrid(row, col, true);
    }

    protected onTouchEnd(event: EventTouch): void {
    }

    protected onToggleChange(toggle: Toggle): void {
        this.isAllDir = this.toggle_openAllDir.isChecked;
        console.log('isAllDir:', this.isAllDir);
    }



    protected onResetClick(): void {
        let width: number = 1280;
        let height: number = 720;

        this.showAllGrids(this.gridWidth, this.gridWidth, width, height);

        this.startPoint = v2(8, 3);
        this.destPoint = v2(18, 55);

        this._aStar.resetAllGrids();


        // this.destPoint = v2(20, 100);

        this.showStartPoint(this.startPoint.x, this.startPoint.y);
        this.showDestPoint(this.destPoint.x, this.destPoint.y);
    }

    protected onStartAStarClick(): void {
        let paths = this._aStar.getPaths([this.startPoint.x, this.startPoint.y], [this.destPoint.x, this.destPoint.y], this.isAllDir);

        for(let i = 0, length = paths.length; i < length; i++) {
            let point: number[] = paths[i];
            this.drawGridColor(point[0], point[1], new Color(255, 255, 0, 255));
        }

        // sys.localStorage.setItem('wallList', JSON.stringify(this.wallList));
    }

    onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.toggle_openAllDir.node.off('toggle', this.onToggleChange, this);
    }
}

