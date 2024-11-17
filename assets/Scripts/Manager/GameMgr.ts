
export class GameMgr {
    private static instance: GameMgr = null;

    public static getInstance(): GameMgr {
        if(GameMgr.instance === null) {
            GameMgr.instance = new GameMgr();
        }
        return GameMgr.instance;
    }


    private _gameSpeed: number = 1;

    /**
     * 设置游戏执行速度倍率
     * @param gameSpeed 游戏速度倍率
     */
    public setGameSpeed(gameSpeed: number): void {
        this._gameSpeed = gameSpeed;
    }

    /**
     * 获取游戏执行速度倍率
     * @returns 返回速度倍率
     */
    public getGameSpeed(): number {
        return this._gameSpeed;
    }
}

