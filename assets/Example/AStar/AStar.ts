import { COMPARE } from "../../Scripts/Constants";
import { Heap } from "../DataStructureAndAlgorithm/Heap";


/** 格子类型 */
enum GRID_TYPE {
    NONE,
    /** 正常格子 */
    NORMAL,
    /** 障碍物 */
    OBSTACLE,
}

/** 格子对象 */
interface Grid {
    /** 行 */
    row: number;
    /** 列 */
    col: number;

    g: number,
    h: number;

    /** 格子类型 */
    type: GRID_TYPE;

    /** 父节点 */
    parent: Grid;
}


export class AStar {

    // /** open表 */
    // private _openList: Grid[] = [];
    /** open表(二叉堆形式) */
    private _heap: Heap = null;
    /** close表 */
    private _closeList: Grid[] = [];

    /** 所有的格子数据（二维数组） */
    private _allGridList: Grid[][] = [];

    /** 单元格的宽度 */
    private _gridWidth: number = 20;
    /** 单元格的高度 */
    private _gridHeight: number = 20;

    /** 总行数 */
    private _totalRow: number = 18;
    /** 总列数 */
    private _totalCol: number = 32;

    private _startPoint: number[] = [0, 0];
    private _destPoint: number[] = [0, 0];

    /** 是否开放所有方向？除了上下左右，还包括左上、左下、右上、右下 */
    private _isAllDir: boolean = false;

    /**
     * A星对象构造方法
     * @param gridWidth 单元格宽度
     * @param gridHeight 单元格高度
     * @param width 区域宽度
     * @param height 区域高度
     */
    constructor(gridWidth: number, gridHeight: number, width: number, height: number) {
        this._gridWidth = gridWidth;
        this._gridHeight = gridHeight;

        this._totalRow = Math.ceil(height / this._gridHeight);
        this._totalCol = Math.ceil(width / this._gridWidth);

        for (let row = 0; row < this._totalRow; row++) {
            this._allGridList[row] = [];
            for (let col = 0; col < this._totalCol; col++) {
                this._allGridList[row][col] = {
                    row: row,
                    col: col,
                    g: 0,
                    h: 0,
                    type: GRID_TYPE.NORMAL,
                    parent: null
                };
            }
        }
    }

    /**
     * 设置指定单元格是否是障碍物
     * @param row 单元格所在行
     * @param col 单元格所在列
     * @param isWall 是否是障碍物
     * @returns 返回结果
     */
    public setGrid(row: number, col: number, isWall: boolean): boolean {
        if (row < 0 || row >= this._totalRow) {
            return false;
        }
        if (col < 0 || col >= this._totalCol) {
            return false;
        }
        this._allGridList[row][col].type = isWall ? GRID_TYPE.OBSTACLE : GRID_TYPE.NORMAL;
        return true;
    }

    /**
     * 重置所有单元格
     */
    public resetAllGrids(): void {
        for (let row = 0; row < this._totalRow; row++) {
            for (let col = 0; col < this._totalCol; col++) {
                if (!this._allGridList[row]) {
                    this._allGridList[row] = [];
                }
                if (this._allGridList[row][col]) {
                    this._allGridList[row][col].type = GRID_TYPE.NORMAL;
                }
                else {
                    this._allGridList[row][col] = {
                        row: row,
                        col: col,
                        g: 0,
                        h: 0,
                        type: GRID_TYPE.NORMAL,
                        parent: null
                    };
                }
            }
        }
    }

    /**
     * 检查相邻格子的位置
     * @param parentGrid 目标格子对象
     * @param nextRow 相邻格子的行
     * @param nextCol 相邻格子的列
     */
    protected setAdjoinGrid(parentGrid: Grid, nextRow: number, nextCol: number): void {
        if (nextRow !== parentGrid.row || nextCol !== parentGrid.col) {
            let nextGrid: Grid = this._allGridList[nextRow][nextCol];
            if (this._closeList.indexOf(nextGrid) < 0 && nextGrid.type !== GRID_TYPE.OBSTACLE) {
                let g: number = parentGrid.g;
                if (nextRow !== parentGrid.row && nextCol !== parentGrid.col) {
                    g += 14;
                }
                else {
                    g += 10;
                }
                // 这是启发式的
                let h: number = (Math.abs(this._destPoint[0] - nextGrid.row) + Math.abs(this._destPoint[1] - nextGrid.col)) * 10;
                // if (this._openList.indexOf(nextGrid) < 0) {
                if (!this._heap.haveValue(nextGrid)) {
                    nextGrid.g = g;
                    nextGrid.h = h;
                    nextGrid.parent = parentGrid;
                    // this._openList[this._openList.length] = nextGrid;
                    this._heap.insert(nextGrid);
                }
                else {
                    if ((nextGrid.g + nextGrid.h) > (g + h)) {
                        nextGrid.g = g;
                        nextGrid.h = h;
                        nextGrid.parent = parentGrid;
                    }
                }
            }
        }
    }

    /**
     * 获取从起点到终点的路径
     * @param startPoint 开始位置（包含行和列的两元素数组）
     * @param destpoint 结束位置（包含行和列的两元素数组）
     * @param isAllDir 是否开放所有方向（八个方向）
     * @returns 返回路径（一组从开始位置到目标位置的单元格路径，数组中每个元素就是一个包含行和列的两元素数组）
     */
    public getPaths(startPoint: number[], destpoint: number[], isAllDir: boolean = false): number[][] {
        this._startPoint = startPoint;
        this._destPoint = destpoint;
        this._isAllDir = isAllDir;

        // this._openList = [];
        this._heap = new Heap(true, (a: Grid, b: Grid) => {
            let delta: number = (a.g + a.h) - (b.g + b.h);
            if (delta < 0) {
                return COMPARE.LESS_THAN;
            }
            else if (delta > 0) {
                return COMPARE.BIGGER_THAN;
            }
            else {
                return COMPARE.EQUAL;
            }
        });
        this._closeList = [];

        // this._openList[this._openList.length] = this._allGridList[this._startPoint[0]][this._startPoint[1]];
        this._heap.insert(this._allGridList[this._startPoint[0]][this._startPoint[1]]);

        let pathGridList: Grid[] = [];

        let startTime: number = (new Date()).getTime();

        // while (this._openList.length > 0) {
        while (this._heap.size() > 0) {
            // 排序
            // this._openList.sort((a: Grid, b: Grid) => {
            //     return (a.g + a.h) - (b.g + b.h);
            // });
            // let grid: Grid = this._openList.shift();
            let grid: Grid = this._heap.extractExtremeValue();
            this._closeList[this._closeList.length] = grid;

            if (grid.row === this._destPoint[0] && grid.col === this._destPoint[1]) {
                console.log('有通路！');
                while (grid) {
                    pathGridList.unshift(grid);
                    grid = grid.parent;
                }
                break;
            }

            let nextRow: number = grid.row;
            let nextCol: number = grid.col;
            if (grid.row < (this._totalRow - 1)) {
                // 上
                nextRow = grid.row + 1;
                nextCol = grid.col;
                this.setAdjoinGrid(grid, nextRow, nextCol);
            }
            if (grid.row > 0) {
                // 下
                nextRow = grid.row - 1;
                nextCol = grid.col;
                this.setAdjoinGrid(grid, nextRow, nextCol);
            }

            if (grid.col > 0) {
                // 左
                nextRow = grid.row;
                nextCol = grid.col - 1;
                this.setAdjoinGrid(grid, nextRow, nextCol);
            }
            if (grid.col < (this._totalCol - 1)) {
                // 右
                nextRow = grid.row;
                nextCol = grid.col + 1;
                this.setAdjoinGrid(grid, nextRow, nextCol);
            }

            if (this._isAllDir) {
                if (grid.col > 0 && grid.row < (this._totalRow - 1)) {
                    // 左上
                    nextRow = grid.row + 1;
                    nextCol = grid.col - 1;

                    if (this._allGridList[nextRow][grid.col].type !== GRID_TYPE.OBSTACLE && this._allGridList[grid.row][nextCol].type !== GRID_TYPE.OBSTACLE) {
                        this.setAdjoinGrid(grid, nextRow, nextCol);
                    }
                }
                if (grid.col > 0 && grid.row > 0) {
                    // 左下
                    nextRow = grid.row - 1;
                    nextCol = grid.col - 1;

                    if (this._allGridList[nextRow][grid.col].type !== GRID_TYPE.OBSTACLE && this._allGridList[grid.row][nextCol].type !== GRID_TYPE.OBSTACLE) {
                        this.setAdjoinGrid(grid, nextRow, nextCol);
                    }
                }
                if (grid.col < (this._totalCol - 1) && grid.row < (this._totalRow - 1)) {
                    // 右上
                    nextRow = grid.row + 1;
                    nextCol = grid.col + 1;

                    if (this._allGridList[nextRow][grid.col].type !== GRID_TYPE.OBSTACLE && this._allGridList[grid.row][nextCol].type !== GRID_TYPE.OBSTACLE) {
                        this.setAdjoinGrid(grid, nextRow, nextCol);
                    }
                }
                if (grid.col < (this._totalCol - 1) && grid.row > 0) {
                    // 右下
                    nextRow = grid.row - 1;
                    nextCol = grid.col + 1;

                    if (this._allGridList[nextRow][grid.col].type !== GRID_TYPE.OBSTACLE && this._allGridList[grid.row][nextCol].type !== GRID_TYPE.OBSTACLE) {
                        this.setAdjoinGrid(grid, nextRow, nextCol);
                    }
                }
            }
        }

        let endTime: number = (new Date()).getTime();
        let deltaTime: number = endTime - startTime;
        console.log(`A星寻路用时：${deltaTime}ms`);

        if (pathGridList.length > 0) {
            let paths: number[][] = [];
            for (let i = 0, count = pathGridList.length; i < count; i++) {
                let grid: Grid = pathGridList[i];
                paths[paths.length] = [grid.row, grid.col];
                if (grid.row === this._startPoint[0] && grid.col === this._startPoint[1]) {
                    continue;
                }
                if (grid.row === this._destPoint[0] && grid.col === this._destPoint[1]) {
                    continue;
                }
            }
            return paths;
        }
        else {
            console.log('没有通路！');
            return [];
        }
    }
}

