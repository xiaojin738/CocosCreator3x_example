import { _decorator, Component, instantiate, isValid, Node, NodePool, Prefab, ScrollView, UITransform, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ListView')
export class ListView extends Component {

    /** ScrollView滚动视图的滚动节点 */
    private _content: Node = null;

    /** 是否是竖直滚动视图 */
    private _isVertical: boolean = true;

    /** 滚动视图可视区域的top */
    private _top: number = 0;
    /** 滚动视图可视区域的bottom */
    private _bottom: number = 0;

    private _left: number = 0;
    private _right: number = 0;

    /** 单元格宽度 */
    private _itemW: number = 0;
    /** 单元格高度 */
    private _itemH: number = 0;

    /** 同时显示的单元格节点数据 */
    private _itemList: { index: number, node: Node }[] = [];

    /** 总共多少单元格 */
    private _totalItemCount: number = 0;
    /** 所有的数据 */
    private _dataList: any[] = [];
    /** 同时显示多少个单元格 */
    private _showItemCount: number = 0;
    /** 单元格的脚本组件名 */
    private _scriptName: string = '';

    private _templateNodeItem: Prefab | Node = null;

    /** 滚动节点最开始的位置 */
    private _initContentPos: Vec3 = v3();

    /** 滚动视图的内容节点x坐标 */
    private _contentX: number = 0;
    /** 滚动视图的内容节点y坐标 */
    private _contentY: number = 0;

    /** 竖直滚动的时候，水平放多少个单元格 */
    private _showHorCount: number = 1;
    /** 水平滚动的时候，竖直放多少个单元格 */
    private _showVerCount: number = 1;

    /** 增加单元格时显示动画的方法 */
    private _addItemAnimateFunc: (node: Node, sortIndex: number, endCallback?: Function) => void = null;
    /** 删除单元格时显示动画的方法 */
    private _deleteItemAnimateFunc: (node: Node, sortIndex: number, endCallback?: Function) => void = null;

    private _needShowItemCount: number = 0;

    /** 单元格对象池 */
    private _itemPool: NodePool = null;

    protected onLoad(): void {
        this._content = this.node.getComponent(ScrollView).content;
        this._itemPool = new NodePool('ListViewItem');
        this._initContentPos = this._content.getPosition();
    }

    start() {

    }

    /**
     * 初始化滚动视图
     * @param node_item 单元格模板
     * @param scriptName 单元格节点下的脚本组件名
     * @param dataList 滚动视图所有的单元格数据
     * @param addItemAnimateFunc 增加单元格时显示动画的方法（自定义）
     * @param deleteItemAnimateFunc 删除单元格时显示动画的方法（自定义）
     * @param needShowItemCount 需要同时显示多少个单元格
     */
    public init(node_item: Prefab | Node, scriptName: string, dataList: any[], addItemAnimateFunc?: (node: Node, sortIndex: number, endCallback?: Function) => void, deleteItemAnimateFunc?: (node: Node, sortIndex: number, endCallback?: Function) => void, needShowItemCount?: number): void {
        var itemW: number = 0;
        var itemH: number = 0;
        if (node_item instanceof Prefab) {
            itemH = node_item.data.getComponent(UITransform).height;
            itemW = node_item.data.getComponent(UITransform).width;
        }
        else if (node_item instanceof Node) {
            itemH = node_item.getComponent(UITransform).height;
            itemW = node_item.getComponent(UITransform).width;
        }

        this._templateNodeItem = node_item;
        this._scriptName = scriptName;
        this._dataList = dataList;
        this._totalItemCount = dataList.length;
        this._addItemAnimateFunc = addItemAnimateFunc;
        this._deleteItemAnimateFunc = deleteItemAnimateFunc;
        this._isVertical = this.node.getComponent(ScrollView).vertical;
        this._needShowItemCount = needShowItemCount;

        this._itemW = itemW;
        this._itemH = itemH;

        let scrollViewW: number = this.node.getComponent(UITransform).width;
        let scrollViewH: number = this.node.getComponent(UITransform).height;

        if (this._isVertical) {
            scrollViewW = this._content.getComponent(UITransform).width;
            // 竖直滚动
            this._showHorCount = ~~(scrollViewW / this._itemW);

            let showItemCount: number = (Math.ceil(scrollViewH / this._itemH) + 2) * this._showHorCount;
            if (showItemCount > this._totalItemCount) {
                showItemCount = this._totalItemCount;
            }

            this._showItemCount = showItemCount;

            let initPosX: number = -(this._showHorCount - 1) / 2 * this._itemW;
            let initPosY: number = -this._itemH * 0.5;

            for (let i = 0; i < showItemCount; i++) {
                let node: Node = this.getItemNode();

                let h: number = ~~(i / this._showHorCount);
                let v: number = i % this._showHorCount;

                let posX: number = initPosX + v * this._itemW;
                let posY: number = initPosY - h * this._itemH;

                node.setParent(this._content);
                node.setPosition(v3(posX, posY, 0));
                if (this._addItemAnimateFunc) {
                    this._addItemAnimateFunc(node, i);
                }
                if (node.getComponent(this._scriptName) && node.getComponent(this._scriptName)['setData']) {
                    node.getComponent(this._scriptName)['setData'](i, this._dataList[i]);
                }

                this._itemList[this._itemList.length] = {
                    index: i,
                    node: node
                };
            }

            this._content.getComponent(UITransform).height = Math.ceil(this._totalItemCount / this._showHorCount) * this._itemH;

            this._contentY = this._content.getPosition().y;

            let wPos: Vec3 = this._content.getWorldPosition();
            this._top = wPos.y + this._itemH * 0.5;
            this._bottom = wPos.y - scrollViewH - this._itemH * 0.5;
        }
        else {
            scrollViewH = this._content.getComponent(UITransform).height;
            // 水平滚动
            this._showVerCount = ~~(scrollViewH / this._itemH);

            let showItemCount: number = (Math.ceil(scrollViewW / this._itemW) + 2) * this._showVerCount;
            if (showItemCount > this._totalItemCount) {
                showItemCount = this._totalItemCount;
            }

            if (!needShowItemCount || needShowItemCount < showItemCount) {
                this._showItemCount = showItemCount;
            }
            else {
                this._showHorCount = needShowItemCount;
            }

            let initPosX: number = this._itemW * 0.5;
            let initPosY: number = (this._showVerCount - 1) / 2 * this._itemH;

            for (let i = 0; i < showItemCount; i++) {
                let node: Node = this.getItemNode();

                let v: number = ~~(i / this._showVerCount);
                let h: number = i % this._showVerCount;

                let posX: number = initPosX + v * this._itemW;
                let posY: number = initPosY - h * this._itemH;

                node.setParent(this._content);
                node.setPosition(v3(posX, posY, 0));
                if (this._addItemAnimateFunc) {
                    this._addItemAnimateFunc(node, i);
                }
                if (node.getComponent(this._scriptName) && node.getComponent(this._scriptName)['setData']) {
                    node.getComponent(this._scriptName)['setData'](i, this._dataList[i]);
                }

                this._itemList[this._itemList.length] = {
                    index: i,
                    node: node
                };
            }

            this._content.getComponent(UITransform).width = Math.ceil(this._totalItemCount / this._showVerCount) * this._itemW;

            this._contentX = this._content.getPosition().x;

            let wPos: Vec3 = this._content.getWorldPosition();
            this._left = wPos.x - this._itemW * 0.5;
            this._right = wPos.x + scrollViewW + this._itemW * 0.5;
        }
    }

    /**
     * 在指定位置索引增加单元格
     * @param index 指定位置索引
     * @param data 新增的单元格数据
     * @returns 返回结果（添加成功返回true，否则就是false）
     */
    public addItem(index: number, data: any): boolean {
        if (index < 0) {
            return false;
        }
        if (index > this._totalItemCount) {
            index = this._totalItemCount;
        }
        let destItems = this._itemList.filter((v) => {
            if (v && v.index === index) {
                return true;
            }
        });

        this._totalItemCount += 1;

        let newItem = {
            index: -1,
            node: null
        };

        let idx: number = -1;
        if (destItems.length > 0) {
            let destItem = destItems[0];
            idx = this._itemList.indexOf(destItem);
            if (idx >= 0) {
                newItem.index = destItem.index;
            }
        }
        if (newItem.index < 0) {
            let lastItem = this._itemList[this._itemList.length - 1];
            if (index === (lastItem.index + 1)) {
                newItem.index = index;
            }
        }

        if (index < this._totalItemCount) {
            this._dataList.splice(newItem.index, -1, data);
        }
        else {
            this._dataList[this._dataList.length] = data;
        }

        if (newItem.index >= 0) {
            if (this._isVertical) {
                // 竖直滚动视图
                this._content.getComponent(UITransform).height = Math.ceil(this._totalItemCount / this._showHorCount) * this._itemH;

                let initPosX: number = -(this._showHorCount - 1) / 2 * this._itemW;
                let initPosY: number = -this._itemH * 0.5;

                if (idx >= 0) {
                    for (let i = idx, count = this._itemList.length; i < count; i++) {
                        let item = this._itemList[i];
                        item.index += 1;

                        let h: number = ~~(item.index / this._showHorCount);
                        let v: number = item.index % this._showHorCount;

                        let posX: number = initPosX + v * this._itemW;
                        let posY: number = initPosY - h * this._itemH;

                        item.node.setPosition(v3(posX, posY, 0));
                        if (item.node.getComponent(this._scriptName) && item.node.getComponent(this._scriptName)['setData']) {
                            item.node.getComponent(this._scriptName)['setData'](item.index, this._dataList[item.index]);
                        }
                    }
                }

                newItem.node = this.getItemNode();
                newItem.node.setParent(this._content);

                let h: number = ~~(newItem.index / this._showHorCount);
                let v: number = newItem.index % this._showHorCount;

                let posX: number = initPosX + v * this._itemW;
                let posY: number = initPosY - h * this._itemH;

                newItem.node.setPosition(v3(posX, posY, 0));
                if (this._addItemAnimateFunc) {
                    this._addItemAnimateFunc(newItem.node, 0);
                }
                if (newItem.node.getComponent(this._scriptName) && newItem.node.getComponent(this._scriptName)['setData']) {
                    newItem.node.getComponent(this._scriptName)['setData'](newItem.index, this._dataList[newItem.index]);
                }
                this._itemList.splice(idx, -1, newItem);
            }
            else {
                // 水平滚动视图
                this._content.getComponent(UITransform).width = Math.ceil(this._totalItemCount / this._showVerCount) * this._itemW;

                let initPosX: number = this._itemW * 0.5;
                let initPosY: number = (this._showVerCount - 1) / 2 * this._itemH;

                if (idx >= 0) {
                    for (let i = idx, count = this._itemList.length; i < count; i++) {
                        let item = this._itemList[i];
                        item.index += 1;

                        let v: number = ~~(item.index / this._showVerCount);
                        let h: number = item.index % this._showVerCount;

                        let posX: number = initPosX + v * this._itemW;
                        let posY: number = initPosY - h * this._itemH;

                        item.node.setPosition(v3(posX, posY, 0));
                        if (item.node.getComponent(this._scriptName) && item.node.getComponent(this._scriptName)['setData']) {
                            item.node.getComponent(this._scriptName)['setData'](item.index, this._dataList[item.index]);
                        }
                    }
                }

                newItem.node = this.getItemNode();
                newItem.node.setParent(this._content);

                let v: number = ~~(newItem.index / this._showVerCount);
                let h: number = newItem.index % this._showVerCount;

                let posX: number = initPosX + v * this._itemW;
                let posY: number = initPosY - h * this._itemH;

                newItem.node.setPosition(v3(posX, posY, 0));
                if (this._addItemAnimateFunc) {
                    this._addItemAnimateFunc(newItem.node, 0);
                }
                if (newItem.node.getComponent(this._scriptName) && newItem.node.getComponent(this._scriptName)['setData']) {
                    newItem.node.getComponent(this._scriptName)['setData'](newItem.index, this._dataList[newItem.index]);
                }
                this._itemList.splice(idx, -1, newItem);
            }
        }
        else {
            // 不用加到同时显示的单元格
            if (this._isVertical) {
                // 竖直滚动视图
                this._content.getComponent(UITransform).height = Math.ceil(this._totalItemCount / this._showHorCount) * this._itemH;
            }
            else {
                // 水平滚动视图
                this._content.getComponent(UITransform).width = Math.ceil(this._totalItemCount / this._showVerCount) * this._itemW;
            }
        }
        return true;
    }

    /**
     * 删除指定顺序索引位置的单元格（说明：如果此时没有节点来显示它，就没有要删除的节点，只是单纯地改动滚动节点尺寸）
     * @param index 指定顺序索引下的单元格
     * @returns 返回结果（如果此时有正在显示的节点，就是true，否则就是false）
     */
    public deleteItem(index: number): boolean {
        let destItems = this._itemList.filter((v) => {
            if (v && v.index === index) {
                return true;
            }
        });
        if (destItems.length > 0) {
            let destItem = destItems[0];
            let idx: number = this._itemList.indexOf(destItem);
            this._itemList.splice(idx, 1);

            this._totalItemCount -= 1;
            this._dataList.splice(index, 1);

            let callFunc = () => {
                destItem.node.setPosition(v3(1000, 0));
                if (this._totalItemCount > 0) {
                    if (this._isVertical) {
                        // 竖直滚动视图
                        this._content.getComponent(UITransform).height = Math.ceil(this._totalItemCount / this._showHorCount) * this._itemH;

                        let initPosX: number = -(this._showHorCount - 1) / 2 * this._itemW;
                        let initPosY: number = -this._itemH * 0.5;

                        for (let i = idx, count = this._itemList.length; i < count; i++) {
                            let item = this._itemList[i];
                            item.index -= 1;

                            let h: number = ~~(item.index / this._showHorCount);
                            let v: number = item.index % this._showHorCount;

                            let posX: number = initPosX + v * this._itemW;
                            let posY: number = initPosY - h * this._itemH;

                            item.node.setPosition(v3(posX, posY, 0));
                            if (item.node.getComponent(this._scriptName) && item.node.getComponent(this._scriptName)['setData']) {
                                item.node.getComponent(this._scriptName)['setData'](item.index, this._dataList[item.index]);
                            }
                        }

                        let firstItem = this._itemList[0];
                        let lastItem = this._itemList[this._itemList.length - 1];
                        if (lastItem.index < (this._totalItemCount - 1)) {
                            // 加入尾部
                            destItem.index = lastItem.index + 1;

                            let h: number = ~~(destItem.index / this._showHorCount);
                            let v: number = destItem.index % this._showHorCount;

                            let posX: number = initPosX + v * this._itemW;
                            let posY: number = initPosY - h * this._itemH;

                            destItem.node.setPosition(v3(posX, posY, 0));
                            if (destItem.node.getComponent(this._scriptName) && destItem.node.getComponent(this._scriptName)['setData']) {
                                destItem.node.getComponent(this._scriptName)['setData'](destItem.index, this._dataList[destItem.index]);
                            }
                            this._itemList[this._itemList.length] = destItem;
                        }
                        else if (firstItem.index > 0) {
                            // 加入首部
                            destItem.index = firstItem.index - 1;

                            let h: number = ~~(destItem.index / this._showHorCount);
                            let v: number = destItem.index % this._showHorCount;

                            let posX: number = initPosX + v * this._itemW;
                            let posY: number = initPosY - h * this._itemH;

                            destItem.node.setPosition(v3(posX, posY, 0));
                            if (destItem.node.getComponent(this._scriptName) && destItem.node.getComponent(this._scriptName)['setData']) {
                                destItem.node.getComponent(this._scriptName)['setData'](destItem.index, this._dataList[destItem.index]);
                            }
                            this._itemList.unshift(destItem);
                        }
                        else {
                            // 删除
                            this.putItemNode(destItem.node);
                        }
                    }
                    else {
                        // 水平滚动视图
                        this._content.getComponent(UITransform).width = Math.ceil(this._totalItemCount / this._showVerCount) * this._itemW;

                        let initPosX: number = this._itemW * 0.5;
                        let initPosY: number = (this._showVerCount - 1) / 2 * this._itemH;

                        for (let i = idx, count = this._itemList.length; i < count; i++) {
                            let item = this._itemList[i];
                            item.index -= 1;

                            let v: number = ~~(item.index / this._showVerCount);
                            let h: number = item.index % this._showVerCount;

                            let posX: number = initPosX + v * this._itemW;
                            let posY: number = initPosY - h * this._itemH;

                            item.node.setPosition(v3(posX, posY, 0));
                            if (item.node.getComponent(this._scriptName) && item.node.getComponent(this._scriptName)['setData']) {
                                item.node.getComponent(this._scriptName)['setData'](item.index, this._dataList[item.index]);
                            }
                        }

                        let firstItem = this._itemList[0];
                        let lastItem = this._itemList[this._itemList.length - 1];
                        if (lastItem.index < (this._totalItemCount - 1)) {
                            // 加入尾部
                            destItem.index = lastItem.index + 1;

                            let v: number = ~~(destItem.index / this._showVerCount);
                            let h: number = destItem.index % this._showVerCount;

                            let posX: number = initPosX + v * this._itemW;
                            let posY: number = initPosY - h * this._itemH;

                            destItem.node.setPosition(v3(posX, posY, 0));
                            if (destItem.node.getComponent(this._scriptName) && destItem.node.getComponent(this._scriptName)['setData']) {
                                destItem.node.getComponent(this._scriptName)['setData'](destItem.index, this._dataList[destItem.index]);
                            }
                            this._itemList[this._itemList.length] = destItem;
                        }
                        else if (firstItem.index > 0) {
                            // 加入首部
                            destItem.index = firstItem.index - 1;

                            let v: number = ~~(destItem.index / this._showVerCount);
                            let h: number = destItem.index % this._showVerCount;

                            let posX: number = initPosX + v * this._itemW;
                            let posY: number = initPosY - h * this._itemH;

                            destItem.node.setPosition(v3(posX, posY, 0));
                            if (destItem.node.getComponent(this._scriptName) && destItem.node.getComponent(this._scriptName)['setData']) {
                                destItem.node.getComponent(this._scriptName)['setData'](destItem.index, this._dataList[destItem.index]);
                            }
                            this._itemList.unshift(destItem);
                        }
                        else {
                            // 删除
                            this.putItemNode(destItem.node);
                        }
                    }
                }
                else {
                    // 删除
                    this.putItemNode(destItem.node);
                }
            };
            if (this._deleteItemAnimateFunc) {
                this._deleteItemAnimateFunc(destItem.node, 0, () => {
                    callFunc();
                });
            }
            else {
                callFunc();
            }
            return true;
        }
        else {
            if (index >= 0 && index < this._totalItemCount) {
                if (this._isVertical) {
                    // 竖直滚动视图
                    this._content.getComponent(UITransform).height = Math.ceil(this._totalItemCount / this._showHorCount) * this._itemH;
                }
                else {
                    // 水平滚动视图
                    this._content.getComponent(UITransform).width = Math.ceil(this._totalItemCount / this._showVerCount) * this._itemW;
                }
            }
        }
        return false;
    }

    /**
     * 获取所有的单元格数据
     * @returns 返回数据
     */
    public getDataList(): any[] {
        return this._dataList;
    }

    /**
     * 更新单元格数据
     * @param dataList 所有单元格数据
     * @param isReset 是否全部重置（true的话就是全部重置，并且滚动视图移动到最开始的位置；否则就只是原地位置更新，前提是单元格总共数量一样）
     */
    public updateDataList(dataList: any, isReset: boolean = true): void {
        if (!dataList) {
            return;
        }
        if (dataList.length === this._dataList.length && !isReset) {
            this._dataList = dataList;
            for (let i = 0, count = this._itemList.length; i < count; i++) {
                let item = this._itemList[i];

                if (item.node.getComponent(this._scriptName) && item.node.getComponent(this._scriptName)['setData']) {
                    item.node.getComponent(this._scriptName)['setData'](item.index, this._dataList[item.index]);
                }
            }
        }
        else {
            // 需要重新刷新（这种情况比较少见，一般通过增加或者删除单元格的接口进行）
            this._dataList = dataList;
            for (let i = 0, count = this._itemList.length; i < count; i++) {
                let item = this._itemList[i];
                if (!item) {
                    continue;
                }
                this.putItemNode(item.node);
            }
            this._content.setPosition(this._initContentPos);
            this._itemList.length = 0;
            this.init(this._templateNodeItem, this._scriptName, this._dataList, this._addItemAnimateFunc, this._deleteItemAnimateFunc, this._needShowItemCount);
        }
    }


    update(deltaTime: number) {
        if (this._showItemCount >= this._totalItemCount) {
            return;
        }
        if (this._itemList.length <= 0) {
            return;
        }

        if (this._isVertical) {
            // 竖直滚动
            let curContentY: number = this._content.getPosition().y;
            let lastContentY: number = this._contentY;
            if (curContentY === lastContentY) {
                return;
            }

            this._contentY = curContentY;

            let firstItem = this._itemList[0];
            let lastItem = this._itemList[this._itemList.length - 1];

            let initPosX: number = -(this._showHorCount - 1) / 2 * this._itemW;
            let initPosY: number = -this._itemH * 0.5;

            if (curContentY > lastContentY) {
                // 向上
                if (lastItem.index >= (this._totalItemCount - 1)) {
                    return;
                }
                let wPos: Vec3 = firstItem.node.getWorldPosition();
                if (wPos.y > this._top) {
                    for (let i = 0; i < this._showHorCount; i++) {
                        if (this._itemList[this._itemList.length - 1].index >= (this._totalItemCount - 1)) {
                            break;
                        }
                        firstItem = this._itemList.shift();
                        firstItem.index = this._itemList[this._itemList.length - 1].index + 1;
                        this._itemList[this._itemList.length] = firstItem;

                        let h: number = ~~(firstItem.index / this._showHorCount);
                        let v: number = firstItem.index % this._showHorCount;

                        let posX: number = initPosX + v * this._itemW;
                        let posY: number = initPosY - h * this._itemH;

                        firstItem.node.setPosition(v3(posX, posY, 0));
                        if (firstItem.node.getComponent(this._scriptName) && firstItem.node.getComponent(this._scriptName)['setData']) {
                            firstItem.node.getComponent(this._scriptName)['setData'](firstItem.index, this._dataList[firstItem.index]);
                        }
                    }
                }
            }
            else {
                // 向下
                if (firstItem.index <= 0) {
                    return;
                }
                let wPos: Vec3 = lastItem.node.getWorldPosition();
                if (wPos.y < this._bottom) {
                    let lastH: number = ~~(lastItem.index / this._showHorCount);
                    for (let i = 0; i < this._showHorCount; i++) {
                        if (this._itemList[0].index <= 0) {
                            break;
                        }
                        lastItem = this._itemList[this._itemList.length - 1];
                        let temp: number = ~~(lastItem.index / this._showHorCount);
                        if (lastH !== temp) {
                            break;
                        }

                        this._itemList.pop();
                        lastItem.index = this._itemList[0].index - 1;
                        this._itemList.unshift(lastItem);

                        let h: number = ~~(lastItem.index / this._showHorCount);
                        let v: number = lastItem.index % this._showHorCount;

                        let posX: number = initPosX + v * this._itemW;
                        let posY: number = initPosY - h * this._itemH;

                        lastItem.node.setPosition(v3(posX, posY, 0));
                        if (lastItem.node.getComponent(this._scriptName) && lastItem.node.getComponent(this._scriptName)['setData']) {
                            lastItem.node.getComponent(this._scriptName)['setData'](lastItem.index, this._dataList[lastItem.index]);
                        }
                    }
                }
            }
        }
        else {
            // 水平滚动
            let curContentX: number = this._content.getPosition().x;
            let lastContentX: number = this._contentX;
            if (curContentX === lastContentX) {
                return;
            }

            this._contentX = curContentX;

            let firstItem = this._itemList[0];
            let lastItem = this._itemList[this._itemList.length - 1];

            let initPosX: number = this._itemW * 0.5;
            let initPosY: number = (this._showVerCount - 1) / 2 * this._itemH;

            if (curContentX < lastContentX) {
                // 向左
                if (lastItem.index >= (this._totalItemCount - 1)) {
                    return;
                }
                let wPos: Vec3 = firstItem.node.getWorldPosition();
                if (wPos.x < this._left) {
                    for (let i = 0; i < this._showVerCount; i++) {
                        if (this._itemList[this._itemList.length - 1].index >= (this._totalItemCount - 1)) {
                            break;
                        }
                        firstItem = this._itemList.shift();
                        firstItem.index = this._itemList[this._itemList.length - 1].index + 1;
                        this._itemList[this._itemList.length] = firstItem;

                        let v: number = ~~(firstItem.index / this._showVerCount);
                        let h: number = firstItem.index % this._showVerCount;

                        let posX: number = initPosX + v * this._itemW;
                        let posY: number = initPosY - h * this._itemH;

                        firstItem.node.setPosition(v3(posX, posY, 0));
                        if (firstItem.node.getComponent(this._scriptName) && firstItem.node.getComponent(this._scriptName)['setData']) {
                            firstItem.node.getComponent(this._scriptName)['setData'](firstItem.index, this._dataList[firstItem.index]);
                        }
                    }
                }
            }
            else {
                // 向右
                if (firstItem.index <= 0) {
                    return;
                }
                let wPos: Vec3 = lastItem.node.getWorldPosition();
                if (wPos.x > this._right) {
                    let lastW: number = ~~(lastItem.index / this._showVerCount);
                    for (let i = 0; i < this._showVerCount; i++) {
                        if (this._itemList[0].index <= 0) {
                            break;
                        }
                        lastItem = this._itemList[this._itemList.length - 1];
                        let temp: number = ~~(lastItem.index / this._showVerCount);
                        if (lastW !== temp) {
                            break;
                        }

                        this._itemList.pop();
                        lastItem.index = this._itemList[0].index - 1;
                        this._itemList.unshift(lastItem);

                        let v: number = ~~(lastItem.index / this._showVerCount);
                        let h: number = lastItem.index % this._showVerCount;

                        let posX: number = initPosX + v * this._itemW;
                        let posY: number = initPosY - h * this._itemH;

                        lastItem.node.setPosition(v3(posX, posY, 0));
                        if (lastItem.node.getComponent(this._scriptName) && lastItem.node.getComponent(this._scriptName)['setData']) {
                            lastItem.node.getComponent(this._scriptName)['setData'](lastItem.index, this._dataList[lastItem.index]);
                        }
                    }
                }
            }
        }
    }

    /**
     * 获取单元格节点
     * @returns 返回单元格节点
     */
    public getItemNode(): Node {
        if (!this._itemPool) {
            this._itemPool = new NodePool('ListViewItem');
        }
        let node: Node = null;
        if (this._itemPool.size() > 0) {
            node = this._itemPool.get();
        }
        else {
            node = instantiate(this._templateNodeItem) as Node;
        }
        if (this._itemPool.size() <= 0) {
            let nextNode: Node = instantiate(node);
            this._itemPool.put(nextNode);
        }
        return node;
    }

    /**
     * 回收单元格节点
     * @param node 单元格节点
     */
    private putItemNode(node: Node): boolean {
        if (!isValid(node)) {
            return false;
        }
        if (!this._itemPool) {
            this._itemPool = new NodePool('ListViewItem');
        }
        this._itemPool.put(node);
        return true;
    }

    protected onDestroy(): void {
        this._itemPool.clear();
        console.log('ListView onDestroy');
    }
}

