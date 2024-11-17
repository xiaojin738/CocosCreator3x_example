
export class CommonData {

    private static instance: CommonData = null;

    public static getInstance(): CommonData {
        if(CommonData.instance === null) {
            CommonData.instance = new CommonData();
        }
        return CommonData.instance;
    }

    protected clearup(): void {
        //
    }

    public static purge(): void {
        if(CommonData.instance) {
            CommonData.instance.clearup();
            CommonData.instance = null;
        }
    }

    public rankData: number[] = [];
}

