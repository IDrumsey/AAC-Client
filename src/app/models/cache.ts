import { ApiRequests } from "./api-requests";

export class Cache {
    localStorageKey: string;
    minutesToExpiration = 1;
    private requests: ApiRequests.ApiRequest<any>[] = []

    constructor(localStorageKey: string){
        this.localStorageKey = localStorageKey;

        this.startCleanCacheInterval();
    }

    getRequestFromCache(endpoint: string): ApiRequests.ApiRequest<any> | null {
        for(let index = 0; index < this.requests.length; index++){
            let request = this.requests[index];
            if(this.isRequestExpired(request)){
                this.removeCachedRequest(index, "expired");
            }
            else{
                if(request.endpoint == endpoint){
                    return request;
                }
            }
        }

        return null;
    }

    isRequestExpired(request: ApiRequests.ApiRequest<any>): boolean{
        let currentTime = new Date();

        let projectedExpirationTime = new Date(request.timeResponseReceived);
        projectedExpirationTime.setMinutes(projectedExpirationTime.getMinutes() + this.minutesToExpiration);

        return projectedExpirationTime <= currentTime;
    }

    removeCachedRequest(index: number, reason: string): void{
        console.log(`(${reason}) removing cached request : `, this.requests[index]);
        this.requests.splice(index, 1);

        this.saveToLocalStorage();
    }

    addRequest(requestToAdd: ApiRequests.ApiRequest<any>): void{
        this.requests.push(requestToAdd);
        this.saveToLocalStorage();
    }

    saveToLocalStorage(): void{
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.requests));
    }

    initFromLocalStorage(): void{
        let localStorageRequestsAsJson = localStorage.getItem(this.localStorageKey);
        if(localStorageRequestsAsJson != null){
            this.requests = JSON.parse(localStorageRequestsAsJson);
        }
    }

    cleanCache(): void{
        for(let index = 0; index < this.requests.length; index++){
            let request = this.requests[index];
            if(this.isRequestExpired(request)){
                this.removeCachedRequest(index, "expired");
            }
        }

        this.saveToLocalStorage();
    }

    startCleanCacheInterval(){
        setInterval(() => {
            this.cleanCache();
        }, this.minutesToMilliseconds(this.minutesToExpiration))
    }

    private minutesToMilliseconds(minutes: number){
        return minutes * 60000;
    }

    clearSpecifiedEndpoint(endpoint: string){
        console.log("clearing endpoint : ", endpoint);
        let indecesToRemove: number[] = [];
        this.requests.forEach((req, index) => {
            if(req.endpoint == endpoint){
                indecesToRemove.push(index);
            }
        })
        this.removeMultipleRequestsByIndeces(indecesToRemove);
    }

    removeMultipleRequestsByIndeces(indecesToRemove: number[]){
        let indexDiff = 0;
        indecesToRemove.forEach(index => {
            this.removeCachedRequest(index - indexDiff, "clearing endpoints");
            indexDiff++;
        })
    }

    createCachedDataPromise<dataType>(data: dataType){
        return new Promise<dataType>((resolve, reject) => {
          resolve(data);
        })
    }
}
