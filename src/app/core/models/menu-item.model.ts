import { MenuItem } from 'primeng/api';

export interface IMenuItem {
    label: string;
    icon?: string;
    route?: string;
    menu?: MenuItem[];
    command?: () => void;
    tooltip?: boolean;
    children?: IMenuItem[];
}
