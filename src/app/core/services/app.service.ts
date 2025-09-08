import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AppService {

    public models: any[] = []
    public agents: any[] = []
    public datasets = {
        generating: [] as any[],
        generated: [] as any[],
        ready: [] as any[],
        training: [] as any[]
    }

    public configurations: any[] = []
    public data: any[] = []

    constructor() { }

}