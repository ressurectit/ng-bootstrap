import {Directive,
        Input} from '@angular/core';
import {isPresent, isBlank} from '@anglr/common';

/**
 * Directive that wraps options for bootstrap select
 */
@Directive(
{
    selector: "option.selectpicker",
    host:
    {
        "value": "_optionValue",
        "[value]": "_optionValue"
    }
})
export class BootstrapSelectOptionDirective
{
    //######################### private fields #########################

    /**
     * Value of option attribute value
     */
    private _optionValue: string;

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
    public set valueProperty(val: string)
    {
        this._valueProperty = val;

        if(isPresent(this.value))
        {
            if(isBlank(this.value[this.valueProperty]))
            {
                throw new Error(`Specified property does not exists or is not set '${this.valueProperty}'!`);
            }

            this._optionValue = this.value[this.valueProperty];
        }
    }
    public get valueProperty(): string
    {
        return this._valueProperty;
    }

    /**
     * Gets or sets real value of option
     */
    @Input()
    public set value(val: any)
    {
        this._value = val;

        if(isBlank(this.valueProperty))
        {
            this._optionValue = val;
        }
        else
        {
            if(isBlank(val[this.valueProperty]))
            {
                throw new Error(`Specified property does not exists or is not set '${this.valueProperty}'!`);
            }

            this._optionValue = val[this.valueProperty];
        }
    }
    public get value(): any
    {
        return this._value;
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
     * @param  {any} val Value to be compared
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
            if(isBlank(val[this.valueProperty]))
            {
                throw new Error(`Specified property does not exists or is not set '${this.valueProperty}'!`);
            }

            return val[this.valueProperty] == this.value[this.valueProperty];
        }
    }
}