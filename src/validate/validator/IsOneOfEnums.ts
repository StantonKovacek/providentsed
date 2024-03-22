import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as _ from 'lodash';

export function IsOneOfEnums(items: Array<any>, options?: ValidationOptions): Function {
    items = _.compact(items);
    return (object: any, propertyName: string): void => {
        registerDecorator({
            name: 'IsOneOfEnums',
            target: object.constructor,
            propertyName,
            constraints: [propertyName],
            options: options,
            validator: {
                validate: (value: any, validationArguments?: ValidationArguments): boolean => items.some(item => Object.values(item).includes(value)),
                defaultMessage: (validationArguments?: ValidationArguments): string => `${propertyName} must be one of enums`
            }
        });
    };
}
