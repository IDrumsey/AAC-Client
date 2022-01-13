import {HttpClient} from '@angular/common/http';
import {Cache} from '../models/cache';

export namespace ApiRequests {

export class ApiRequest<T> {
    endpoint: string;
    options: Object;
    timeSent: Date;
    timeResponseReceived: Date;
    response: T;
    api: HttpClient;
    endpointsToClear: string[];

    constructor(api: HttpClient, endpoint: string, options: Object, endpointsToClear?: string[]){
        this.api = api;
        this.endpoint = endpoint
        this.options = options;
        this.timeSent = new Date();
        this.endpointsToClear = [this.endpoint];
        if(endpointsToClear){
            this.endpointsToClear = this.endpointsToClear.concat(endpointsToClear);
        }
    }

    markResponseTime(){
        this.timeResponseReceived = new Date();
    }

    cacheRequest(cache: Cache){
        console.log("caching request: ", this.endpoint);
        cache.addRequest(this);
    }

    cleanMarkedEndpoints(cache: Cache){
        if(this.endpointsToClear){
            this.endpointsToClear.forEach(endpoint => {
                cache.clearSpecifiedEndpoint(endpoint);
            })
        }
    }

    getFromCache(cacheToCheck: Cache): ApiRequest<T> | null {
        return cacheToCheck.getRequestFromCache(this.endpoint);
    }
}

export class UploadDataRequest<uploadDataType, responseType> extends ApiRequest<responseType> {
    dataToSend: uploadDataType;

    constructor(api: HttpClient, endpoint: string, options: Object, data: uploadDataType, endpointsToClear?: string[]){
        super(api, endpoint, options, endpointsToClear);
        this.dataToSend = data;
    }
}

export class PostRequest<uploadDataType, responseType> extends UploadDataRequest<uploadDataType, responseType> {

    constructor(api: HttpClient, endpoint: string, options: Object, data: uploadDataType, endpointsToClear?: string[]){
        super(api, endpoint, options, data, endpointsToClear)
    }

    send(cache: boolean, cacheStorage?: Cache): Promise<responseType>{
        return this.api.post<responseType>(this.endpoint, this.dataToSend, this.options).toPromise().then(response => {
            this.response = response;
            this.markResponseTime();
            if(cache && cacheStorage){
                this.cacheRequest(cacheStorage);
            }
            if(this.endpointsToClear && cacheStorage){
                console.log("marked endpoints : ", this.endpointsToClear)
                this.cleanMarkedEndpoints(cacheStorage);
            }
            return response;
        })
    }
}

export class PutRequest<uploadDataType, responseType> extends UploadDataRequest<uploadDataType, responseType> {
    
    constructor(api: HttpClient, endpoint: string, options: Object, data: uploadDataType, endpointsToClear?: string[]){
        super(api, endpoint, options, data, endpointsToClear)
    }

    send(cache: boolean, cacheStorage?: Cache){
        return this.api.put<responseType>(this.endpoint, this.dataToSend, this.options).toPromise().then(response => {
            this.response = response;
            this.markResponseTime();
            if(cache && cacheStorage){
                this.cacheRequest(cacheStorage);
            }
            if(this.endpointsToClear && cacheStorage){
                console.log("marked endpoints : ", this.endpointsToClear)
                this.cleanMarkedEndpoints(cacheStorage);
            }
            return response;
        })
    }
}

export class GetRequest<responseType> extends ApiRequest<responseType> {

    constructor(api: HttpClient, endpoint: string, options: Object, endpointsToClear?: string[]){
        super(api, endpoint, options, endpointsToClear)
    }

    sendAsync(cacheToStoreResponse?: Cache): Promise<responseType> {
        if(cacheToStoreResponse){
            let cachedRequest = this.getFromCache(cacheToStoreResponse);
            if(cachedRequest != null){
                console.log("request : ", this.endpoint, " from cache")
                return cacheToStoreResponse.createCachedDataPromise<responseType>(cachedRequest.response);
            }
        }
        return this.api.get<responseType>(this.endpoint, this.options).toPromise().then(response => {
            this.response = response;
            console.log("request : ", this.endpoint, " from api : ")
            this.markResponseTime();
            if(cacheToStoreResponse){
                this.cacheRequest(cacheToStoreResponse);
            }
            return response;
        });
    }
}

export class DeleteRequest<responseType> extends ApiRequest<responseType> {

    constructor(api: HttpClient, endpoint: string, options: Object, endpointsToClear?: string[]){
        super(api, endpoint, options, endpointsToClear)
    }

    send(cache: boolean, cacheStorage?: Cache){
        return this.api.delete<responseType>(this.endpoint, this.options).toPromise().then(response => {
            this.response = response;
            this.markResponseTime();
            if(cache && cacheStorage){
                this.cacheRequest(cacheStorage);
            }
            if(this.endpointsToClear && cacheStorage){
                console.log("marked endpoints : ", this.endpointsToClear)
                this.cleanMarkedEndpoints(cacheStorage);
            }
            return response;
        })
    }
}
}