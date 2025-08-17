export type ModelConfigurationAttributeValueRuleType = 'configuration' | 'data' | 'randint';

export interface ModelConfigurationAttributeValueRule {
    type: ModelConfigurationAttributeValueRuleType;
    value: string | { [key: string]: any };
}

export type ModelConfigurationAttributeValueType = 'string' | 'number' | 'array';

export interface ModelConfigurationAttributeValue {
    type: ModelConfigurationAttributeValueType;
    rule: ModelConfigurationAttributeValueRule;
}

export type ModelConfigurationAttributeRulesType = 'regex' | 'required';

export interface ModelConfigurationAttributeRules {
    type: ModelConfigurationAttributeRulesType;
    value: string | { [key: string]: any };
}

export interface ModelConfigurationAttribute {
    key: string;
    value: ModelConfigurationAttributeValue;
    frequency: number;
    rules: Array<ModelConfigurationAttributeRules>;
}

export interface ModelConfiguration {
    map: Record<string, unknown>;
    attributes: Array<ModelConfigurationAttribute>;
    settings: any;
}