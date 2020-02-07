import {Directive,
        Input} from '@angular/core';
import {isPresent, isBlank} from '@jscrpt/common';

/**
 * Directive that wraps options for bootstrap select
 */
@Directive(
{
    selector: "option.selectpicker",
    host:
    {
        "value": "optionValue",
        "[value]": "optionValue"
    }
})
export class BootstrapSelectOptionDirective
{
    //######################### private fields #########################

    /**
     * Value of option attribute value
     */
    public optionValue: string;

    /**
     * Real value of option
     */
    private _value: any;

    /**
     * Value property that is used for extracting unique value from object value
     */
    private _valueProperty: string;
    
    //######################### public properties - inputs #########################

    /**
     * Value property that is used for extracting unique value from object value
     */
    @Input()
    public get valueProperty(): string
    {
        return this._valueProperty;
    }
    public set valueProperty(val: string)
    {
        this._valueProperty = val;

        if(isPresent(this.value))
        {
            if(isBlank(this.value[this.valueProperty]))
            {
                throw new Error(`Specified property does not exists or is not set '${this.valueProperty}'!`);
            }

            this.optionValue = this.value[this.valueProperty];
        }
    }

    /**
     * Gets or sets real value of option
     */
    @Input()
    public get value(): any
    {
        return this._value;
    }
    public set value(val: any)
    {
        this._value = val;

        if(isBlank(this.valueProperty) || isBlank(val))
        {
            this.optionValue = val;
        }
        else
        {
            if(isBlank(val[this.valueProperty]))
            {
                throw new Error(`Specified property does not exists or is not set '${this.valueProperty}'!`);
            }

            this.optionValue = val[this.valueProperty];
        }
    }
    
    //######################### public properties #########################
    
    /**
     * Unique id of current option
     */
    public get id(): string
    {
        if(isBlank(this.valueProperty))
        {
            return this._value;
        }

        return this._value[this.valueProperty];
    }
    
    //######################### constructor #########################
    constructor()
    {
    }

    //######################### public methods #########################
    
    /**
     * Compares provided value with current option value
     * @param val - Value to be compared
     * @returns boolean
     */
    public isEqual(val: any): boolean
    {
        if(isBlank(this.valueProperty))
        {
            return val == this.value;
        }
        else
        {
            if(val === "")
            {
                return false;
            }

            if((isBlank(val) && isPresent(this.value)) ||
               (isBlank(this.value) && isPresent(val)))
            {
                return false;
            }

            if(isBlank(val) && isBlank(this.value))
            {
                return true;
            }

            if(isBlank(val[this.valueProperty]))
            {
                throw new Error(`Specified property does not exists or is not set '${this.valueProperty}'!`);
            }

            return val[this.valueProperty] == this.value[this.valueProperty];
        }
    }
}