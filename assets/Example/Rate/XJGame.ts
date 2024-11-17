import { director } from "cc";
import { GameMgr } from "../../Scripts/Manager/GameMgr";



let tick = director.tick;
director.tick = function (dt: number) {
    tick.call(this, dt * GameMgr.getInstance().getGameSpeed());
}