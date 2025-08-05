export interface IMenuItem {
    label: string;
    icon?: string;
    route?: string;
    children?: IMenuItem[];
}
