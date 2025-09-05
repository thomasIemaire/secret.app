import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AppService {

    public models = []
    public agents = []
    public datasets = {
        generating: [] as any[],
        generated: [] as any[],
        ready: [] as any[],
        training: [] as any[]
    }

    constructor() { }

}