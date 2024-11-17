import { _decorator, Component, DynamicAtlasManager, Node, Sprite, SpriteFrame, v4, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShaderScene')
export class ShaderScene extends Component {

    @property(Sprite)
    private img_head: Sprite = null;

    start() {
        let sprite: Sprite = this.img_head.getComponent(Sprite);
        let spf: SpriteFrame = sprite.spriteFrame;
        this.scheduleOnce(() => {
            let l: number = spf.uv[0];
            let r: number = spf.uv[6];
            let b: number = spf.uv[3];
            let t: number = spf.uv[5];
            let uvOffset: Vec4 = v4(l, t, r, b);
            let uvRotated: number = spf.rotated ? 1.0 : 0.0;
            console.log('uvOffset:', uvOffset);
            sprite.material.setProperty('uvOffset', uvOffset);
            sprite.material.setProperty('uvRotated', uvRotated);
        });
    }

    update(deltaTime: number) {
        
    }
}
// DynamicAtlasManager.instance.enabled = false;

