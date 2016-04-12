import {Directive, Provider, forwardRef, OnDestroy} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from 'angular2/common';
import {DatetimePickerDirective} from './datetimePicker.directive';
import {Subscription} from 'rxjs/Subscription';

/**
 * Value accessor provider for datetime picker
 */
const DATETIME_PICKER_VALUE_ACCESSOR = new Provider(NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => DatetimePickerControlValueAccessor), multi: true});

/**
 * Value accessor for getting and setting values for datetimepicker
 */
@Directive(
{
    selector: 'input.datetimepicker[ngControl],input.datetimepicker[ngFormControl],input.datetimepicker[ngModel]',
    providers: [DATETIME_PICKER_VALUE_ACCESSOR],
    host: 
    {
        '(blur)': '_onTouched()'
    }
})
export class DatetimePickerControlValueAccessor implements ControlValueAccessor, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Method that is called when picker was touched
     */
    private _onTouched = () => {};
    
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
        this._onTouched = fn;
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