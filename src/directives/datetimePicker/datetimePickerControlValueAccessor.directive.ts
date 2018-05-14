import {Directive, ExistingProvider, forwardRef, OnDestroy} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Subscription} from 'rxjs';

import {DatetimePickerDirective} from './datetimePicker.directive';

/**
 * Value accessor provider for datetime picker
 */
const DATETIME_PICKER_VALUE_ACCESSOR: ExistingProvider =
{
    provide: NG_VALUE_ACCESSOR, 
    useExisting: forwardRef(() => DatetimePickerControlValueAccessor), 
    multi: true
};

/**
 * Value accessor for getting and setting values for datetimepicker
 */
@Directive(
{
    selector: 'input.datetimepicker[formControlName],input.datetimepicker[formControl],input.datetimepicker[ngModel]',
    providers: [DATETIME_PICKER_VALUE_ACCESSOR],
    host: 
    {
        '(blur)': 'onTouched()'
    }
})
export class DatetimePickerControlValueAccessor implements ControlValueAccessor, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Method that is called when picker was touched
     */
    public onTouched = () => {};
    
    /**
     * Subscription that looks for changes of picker
     */
    private _changeSubscription: Subscription = null;

    //######################### public properties #########################

    /**
     * Currently set value
     */
    public value: moment.Moment;

    //######################### constructor #########################
    constructor(private _picker: DatetimePickerDirective)
    {
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * Sets value to select
     */
    public writeValue(value: any): void
    {
        if(value == undefined)
        {
            value = null;
        }
        
        this.value;
        this._picker.value = value;
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: any) => any): void
    {
        this._changeSubscription = this._picker.pickerChanged.subscribe(value =>
        {
            this.value = value;
            
            fn(value);
        });
    }

    /**
     * Registers callback that is called when select is closed
     */
    public registerOnTouched(fn: () => any): void
    {
        this.onTouched = fn;
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

/**
 * Directives that are for datetime picker
 */
export const DATETIME_PICKER_DIRECTIVES = [DatetimePickerDirective, DatetimePickerControlValueAccessor];