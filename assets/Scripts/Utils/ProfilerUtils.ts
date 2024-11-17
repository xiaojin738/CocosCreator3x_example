import { color, Color, find, game, profiler } from "cc";
import RenderUtils from "./RenderUtils";

export class ProfilerUtils {

    /**
     * 设置分析器的样式
     * @param font 内容的颜色
     * @param fontSize 内容的文字字号
     * @param strokeStyle 描边颜色
     * @param lineWidth 描边宽度
     */
    public static setStyle(font: Color, fontSize: number, strokeStyle: Color = color(0, 0, 0, 0.8), lineWidth: number = 2): void {
        let isShowingStats: boolean = profiler.isShowingStats();
        profiler.showStats();
        let ctx = profiler['_ctx'];
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = RenderUtils.colorToRgbaString(font);
        // ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.strokeStyle = RenderUtils.colorToRgbaString(strokeStyle);
        ctx.lineWidth = lineWidth;
        let originFillText = CanvasRenderingContext2D.prototype.fillText;
        ctx.fillText = (text, x, y, maxWidth) => {
            ctx.strokeText(text, x, y);
            originFillText.call(ctx, text, x, y);
        };
        //清空canvas, 重新绘制贴图
        ctx.clearRect(0, 0, 280, 280);
        profiler['_statsDone'] = false;
        profiler.generateStats();
        //删除并重建节点. 如果改了字体尺寸, 则需要重建节点
        profiler['_rootNode'].destroy();
        profiler['_rootNode'] = null;
        profiler.generateNode();

        if(!isShowingStats) {
            profiler.hideStats();
        }
        // let node = find('Profiler_Root');
        // console.log('node:', profiler['_meshRenderer'], node);
    }

}

