import { Asset, assetManager, AssetManager, Prefab, resources } from "cc";

export class AssetsMgr {
    private static instance: AssetsMgr = null;

    public static getInstance(): AssetsMgr {
        if (AssetsMgr.instance === null) {
            AssetsMgr.instance = new AssetsMgr();
        }
        return AssetsMgr.instance;
    }

    public async loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            let bundle: AssetManager.Bundle = assetManager.getBundle(bundleName);
            if (!bundle) {
                assetManager.loadBundle(bundleName, (err: Error, bundle: AssetManager.Bundle) => {
                    if (err || !bundle) {
                        return reject(err);
                    }
                    resolve(bundle);
                });
            }
            else {
                resolve(bundle);
            }
        });
    }


    public async load<T extends Asset>(bundleName: string, paths: string, type: new () => T): Promise<T> {
        return new Promise(async (resolve, reject) => {
            if (bundleName) {
                let bundle: AssetManager.Bundle = await this.loadBundle(bundleName);
                bundle.load(paths, type, (err: Error, data: T) => {
                    if (err || !data) {
                        return reject(err);
                    }
                    resolve(data);
                });
            }
            else {
                resources.load(paths, type, (err: Error, data: T) => {
                    if (err || !data) {
                        return reject(err);
                    }
                    resolve(data);
                });
            }
        });
    }

    public async preload<T extends Asset>(bundleName: string, paths: string | string[], type: new () => T): Promise<T> {
        return new Promise(async (resolve, reject) => {
            if (bundleName) {
                let bundle: AssetManager.Bundle = await this.loadBundle(bundleName);
                bundle.preload(paths, type);
            }
            else {
                resources.preload(paths, type);
            }
        });
    }
}

