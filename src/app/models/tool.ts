import { AdminToolBarComponent } from "../components/admin-tool-bar/admin-tool-bar.component";

export class Tool {
    name: string;
    relay: () => any;

    constructor(name: string, relay: () => any){
        this.name = name;
        this.relay = relay;
    }
}
