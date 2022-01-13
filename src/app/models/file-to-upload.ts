// https://www.codemag.com/Article/1901061/Upload-Small-Files-to-a-Web-API-Using-Angular

export class FileToUpload {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    asBase64: string;

    constructor(name?: string, size?: number, type?: string, lastModified?: number, asBase64?: string){
        if(name){
            this.name = name;
        }
        if(size){
            this.size = size;
        }
        if(type){
            this.type = type;
        }
        if(lastModified){
            this.lastModified = lastModified;
        }
        if(asBase64){
            this.asBase64 = asBase64;
        }
    }
}
