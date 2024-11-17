import { _decorator, Component, Node, Sprite, SpriteFrame, UIRenderer } from 'cc';
import { NoColorAssembler } from './NoColorAssembler';
import { NoColorRenderData, vfmtPosUvColor } from './NoColorRenderData';
const { ccclass, property } = _decorator;




@ccclass('NoColorSprite')
export class NoColorSprite extends Sprite {

    // protected _renderData: NoColorRenderData | null = null;

    protected _flushAssembler (): void {
        const assembler = NoColorAssembler; 

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this.getRenderMaterial(0);
                this.markForUpdateRenderData();
                if (this.spriteFrame) {
                    this._assembler.updateUVs(this);
                }
                this._updateColor();
            }
        }
        console.log('_flushAssembler')
    }
}



