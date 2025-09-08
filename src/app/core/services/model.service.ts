import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class ModelService {

    public model: any;
    private modelClone: any;

    public configuration: any;
    private configurationClone: any;

    private api: ApiService = inject(ApiService);

    constructor() { }

    public getConfiguration() {
        this.api.get(`models/configurations/${this.model.configuration}`).subscribe({
            next: (data: any) => {
                this.configuration = data;
                this.configurationClone = Object.assign({}, this.configuration);
            },
            error: (err: any) => {
                this.configuration = { name: '', description: '', attributes: [], formats: [] };
                this.configurationClone = Object.assign({}, this.configuration);
            }
        });
    }

    public saveConfiguration() {
        this.api.post('models/configurations/', this.configuration).subscribe((configuration: any) => {
            this.configuration = configuration;
            this.model.configuration = configuration._id;
        });
    }

    public getModel(modelId: string) {
        this.api.get(`models/${modelId}`).subscribe((data: any) => {
            this.model = { ...data, mapper: data.mapper ?? {}, randomizers: data.randomizers ?? [] };
            this.modelClone = Object.assign({}, this.model);
            this.getConfiguration();
        });
    }

    public saveModel() {
        if (this.configuration !== this.configurationClone)
            this.saveConfiguration();

        this.api.put(`models/${this.model._id}`, this.model).subscribe((data: any) => {
            this.model = { ...data, mapper: data.mapper ?? {}, randomizers: data.randomizers ?? [] };
        });
    }
}