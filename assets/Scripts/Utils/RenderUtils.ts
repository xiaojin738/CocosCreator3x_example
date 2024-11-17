import { Button, Color, DynamicAtlasManager, Label, Material, Node, Sprite, SpriteFrame, Texture2D, UITransform, Vec2, Vec3, builtinResMgr, color, gfx, isValid } from "cc";

/**
 * 渲染资源工具管理器
 */
export default class RenderUtils {

    /**
     * 读取二维贴图资源的像素数据
     * @param texture 二维贴图资源
     * @param x 起始位置X轴坐标
     * @param y 起始位置Y轴坐标
     * @param width 像素宽度
     * @param height 像素高度
     * @param isFlipY 是否Y轴翻转
     * @returns 返回像素数据
     */
    public static readPixels(texture: Texture2D | any, x = 0, y = 0, width?: number, height?: number, isFlipY: boolean = true): Uint8Array | null {
        width = width || texture.width;
        height = height || texture.height;
        const gfxTexture = texture.getGFXTexture();
        if (!gfxTexture) {
            return null;
        }
        const needSize = 4 * width * height;
        let buffer = new Uint8Array(needSize);

        const gfxDevice = gfx.deviceManager.gfxDevice;

        const bufferViews: ArrayBufferView[] = [];
        const regions: gfx.BufferTextureCopy[] = [];

        const region0 = new gfx.BufferTextureCopy();
        region0.texOffset.x = x;
        region0.texOffset.y = y;
        region0.texExtent.width = width;
        region0.texExtent.height = height;
        regions.push(region0);

        bufferViews.push(buffer);
        gfxDevice?.copyTextureToBuffers(gfxTexture, bufferViews, regions);

        if (isFlipY) {
            let data = this.pixelsFlipY(buffer, width);
            return data;
        }
        return buffer;
    }

    /**
     * 将像素数据进行Y轴翻转
     * @param buffer 贴图像素数据
     * @param width 像素宽度
     * @returns 返回像素数据
     */
    public static pixelsFlipY(buffer: Uint8Array, width: number): Uint8Array {
        let length: number = buffer.length;
        let data = new Uint8Array(length);
        let lineWidth: number = width * 4;
        for (let i = 0, k = length - lineWidth; i < length; i += lineWidth, k -= lineWidth) {
            for (let j = 0; j < lineWidth; j++) {
                data[i + j] = buffer[k + j];
            }
        }
        return data;
    }

    /**
     * 读取目标精灵节点的贴图某个点的颜色值
     * @param node 带有贴图的精灵节点
     * @param localPos 目标节点坐标系下的局部坐标
     * @returns 返回颜色值
     */
    public static readColor(node: Node, localPos: Vec3): Color {
        if (!isValid(node)) {
            return null;
        }
        if (!node.getComponent(Sprite)) {
            return null;
        }
        let spf: SpriteFrame = node.getComponent(Sprite).spriteFrame;
        if (!spf) {
            return null;
        }
        let width: number = node.getComponent(UITransform).width;
        let height: number = node.getComponent(UITransform).height;

        let texture = spf.texture;
        if (spf.original) {
            // 参与了动态合图，则通过original属性获取原始texture
            texture = spf.original._texture;
        }
        let pixelsData: Uint8Array = this.readPixels(texture, 0, 0, Math.ceil(width), Math.ceil(height));

        let anchorPoint: Vec2 = node.getComponent(UITransform).anchorPoint;
        let x: number = localPos.x + width * anchorPoint.x;
        let y: number = localPos.y + height * anchorPoint.y;
        if (x < 0 || x > width) {
            return null;
        }
        if (y < 0 || y > height) {
            return null;
        }
        let index: number = Math.ceil(x) * 4 + Math.ceil(y) * Math.ceil(width) * 4;
        let colors = pixelsData.slice(index, index + 4);
        let clr: Color = color(colors[0], colors[1], colors[2], colors[3]);
        return clr;
    }

    /**
     * 置灰按钮
     * @param node 按钮节点
     * @param show 是否不置灰
     * @param isBindClick 是否关联点击，true：置灰且点击失效
     */
    public static setInteractable(node: Node, show: boolean, isBindClick: boolean = true): void {
        if (!isValid(node)) {
            return;
        }
        if (isBindClick) {
            if (node.getComponent(Button)) {
                node.getComponent(Button).interactable = show;
            }
        }
        let mat: Material = null;
        if (show) {
            mat = builtinResMgr.get(`ui-sprite-material`);
        }
        else {
            mat = builtinResMgr.get(`ui-sprite-gray-material`);
        }
        node.getComponentsInChildren(Sprite).map(sprite => {
            sprite.grayscale = !show;
            // sprite.material = mat;
        });
        node.getComponentsInChildren(Label).map(label => {
            label.material = mat;
        });
    }

    /**
     * 根据图片base64编码数据获取二维贴图资源
     * @param base64Data 图片的base64编码数据
     * @returns 返回Promise实例
     */
    public static getTexture2D(base64Data: string): Promise<Texture2D> {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = function () {
                var texture: Texture2D = new Texture2D();
                texture.reset({
                    width: img.width,
                    height: img.height,
                });
                texture.uploadData(img, 0, 0);
                resolve(texture);
            };
            img.src = 'data:image/png;base64,' + base64Data;
        });
    }

    /**
     * 将Color实例对象转成rgba字符串格式
     * @param color Color实例对象
     * @returns rgba字符串格式
     */
    public static colorToRgbaString(color: Color): string {
        // 获取 r, g, b 值
        const r = color.r;
        const g = color.g;
        const b = color.b;
        // 将 a 的 0-255 值转换为 0-1 的小数
        const a = (color.a / 255).toFixed(2);
        
        // 构建 rgba 字符串
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }


}