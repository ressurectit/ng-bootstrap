import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {forwardRef, ExistingProvider, Directive, OnDestroy} from '@angular/core';
import {isBlank} from '@anglr/common';
import {Subscription} from 'rxjs';

import {BootstrapSelectDirective} from './bootstrapSelect.directive';
import {BootstrapSelectOptionDirective} from './bootstrapSelectOption.directive';

const BOOTSTRAP_SELECT_VALUE_ACCESSOR: ExistingProvider =
{
    provide: NG_VALUE_ACCESSOR, 
    useExisting: forwardRef(() => BootstrapSelectControlValueAccessor), 
    multi: true
};

/**
 * Control value accessor for BootstrapSelectDirective
 */
@Directive(
{
    selector: 'select.selectpicker[formControlName],select.selectpicker[formControl],select.selectpicker[ngModel]',
    providers: [BOOTSTRAP_SELECT_VALUE_ACCESSOR]
})
export class BootstrapSelectControlValueAccessor implements ControlValueAccessor, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Subscription that looks for changes of select
     */
    private _changeSubscription: Subscription = null;
    
    //######################### public properties #########################

    /**
     * Currently set value
     */
    public value: any;
    
    //######################### constructor #########################
    constructor(private _select: BootstrapSelectDirective)
    {
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * Sets value to select
     */
    public writeValue(value: any): void
    {
        if(isBlank(value))
        {
            value = "";
        }
        
        this.value;
        this._select.value = value;
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: any) => any): void
    {
        this._changeSubscription = this._select.selectChanged.subscribe(value =>
        {
            this.value = value;
            
            fn(value);
        });
    }

    /**
     * Registers callback that is called when select is closed
     */
    public registerOnTouched(): void
    {
    }
    
    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._changeSubscription)
        {
            this._changeSubscription.unsubscribe();
            this._changeSubscription = null;
        }
    }
}

export const BOOTSTRAP_SELECT_DIRECTIVES = [BootstrapSelectControlValueAccessor, BootstrapSelectDirective, BootstrapSelectOptionDirective];