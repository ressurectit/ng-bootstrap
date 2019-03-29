import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {forwardRef, ExistingProvider, Directive, OnDestroy} from '@angular/core';
import {isBlank} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {BootstrapSwitchDirective} from './bootstrapSwitch.directive';

const BOOTSTRAP_SELECT_VALUE_ACCESSOR: ExistingProvider =
{
    provide: NG_VALUE_ACCESSOR, 
    useExisting: forwardRef(() => BootstrapSwitchControlValueAccessor), 
    multi: true
};

/**
 * Value accessor for BootstrapSwitchDirective
 */
@Directive(
{
    selector: 'input[type="checkbox"][bootstrap-switch][formControlName],input[type="checkbox"][bootstrap-switch][formControl],input[type="checkbox"][bootstrap-switch][ngModel],input[type="radio"][bootstrap-switch][formControlName],input[type="radio"][bootstrap-switch][formControl],input[type="radio"][bootstrap-switch][ngModel]',
    providers: [BOOTSTRAP_SELECT_VALUE_ACCESSOR]
})
export class BootstrapSwitchControlValueAccessor implements ControlValueAccessor, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Subscription that looks for changes of switch
     */
    private _changeSubscription: Subscription = null;
    
    //######################### constructor #########################
    constructor(private _switch: BootstrapSwitchDirective)
    {
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * Sets value to switch
     */
    public writeValue(value: any): void
    {
        if(isBlank(value))
        {
            value = false;
        }
        
        this._switch.value = value;
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: any) => any): void
    {
        this._changeSubscription = this._switch.valueChanged.subscribe(value =>
        {
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