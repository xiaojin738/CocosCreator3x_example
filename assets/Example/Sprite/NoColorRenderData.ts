import { _decorator, Component, director, gfx, Node, RenderData, renderer } from 'cc';


export interface IRenderData {
    x: number;
    y: number;
    z: number;
    u: number;
    v: number;
}

export class Attribute {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public name: string = '',
        public format: gfx.Format = gfx.Format.UNKNOWN,
        public isNormalized: boolean = false,
        public stream: number = 0,
        public isInstanced: boolean = false,
        public location: number = 0,
    ) {}

    public copy (info: Readonly<Attribute>): Attribute {
        this.name = info.name;
        this.format = info.format;
        this.isNormalized = info.isNormalized;
        this.stream = info.stream;
        this.isInstanced = info.isInstanced;
        this.location = info.location;
        return this;
    }
}


export class NoColorRenderData extends RenderData {
    protected _data: IRenderData[] = [];

    public static add (vertexFormat = vfmtPosUvColor, accessor): NoColorRenderData {
        const rd = new NoColorRenderData(vertexFormat, accessor);
        if (!accessor) {
            const batcher = director.root!.batcher2D;
            accessor = batcher.switchBufferAccessor(rd._vertexFormat);
        }
        rd._accessor = accessor;
        return rd;
    }

    set dataLength (length: number) {
        const data: IRenderData[] = this._data;
        if (data.length !== length) {
            for (let i = data.length; i < length; i++) {
                data.push({
                    x: 0,
                    y: 0,
                    z: 0,
                    u: 0,
                    v: 0,
                });
            }

            data.length = length;
        }
        console.log('data:', data);

        this.syncRender2dBuffer();
    }
}

/**
 * @en Vertex format with the following layout
 * 1. Vector 3 position attribute (Float32)
 * 2. Vector 2 uv attribute (Float32)
 * 3. Vector 4 color attribute (Float32)
 * @zh 包含以下数据的顶点格式
 * 1. 三维位置属性（Float32）
 * 2. 二维贴图 UV 属性（Float32）
 * 3. RGBA 颜色属性（Float32）
 */
export const vfmtPosUvColor = [
    new Attribute(gfx.AttributeName.ATTR_POSITION, gfx.Format.RGB32F),
    new Attribute(gfx.AttributeName.ATTR_TEX_COORD, gfx.Format.RG32F),
];

