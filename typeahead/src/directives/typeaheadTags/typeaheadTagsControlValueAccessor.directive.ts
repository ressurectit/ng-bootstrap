import {Directive, ExistingProvider, forwardRef, OnDestroy} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Subscription} from 'rxjs';

import {TypeaheadTagsComponent} from '../../components/typeaheadTags/typeaheadTags.component';

/**
 * Value accessor provider for typeahead tags
 */
const TYPEAHEAD_TAGS_VALUE_ACCESSOR: ExistingProvider =
{
    provide: NG_VALUE_ACCESSOR, 
    useExisting: forwardRef(() => TypeaheadTagsControlValueAccessor), 
    multi: true
};

/**
 * Value accessor for getting and setting values for typeahead tags
 */
@Directive(
{
    selector: 'div[typeaheadtags][formControlName],div[typeaheadtags][formControl],div[typeaheadtags][ngModel]',
    providers: [TYPEAHEAD_TAGS_VALUE_ACCESSOR],
    host: 
    {
        '(blur)': 'onTouched()'
    }
})
export class TypeaheadTagsControlValueAccessor implements ControlValueAccessor, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Method that is called when typeahead was touched
     */
    public onTouched = () => {};
    
    /**
     * Subscription that looks for changes of typeahead tags
     */
    private _changeSubscription: Subscription = null;

    //######################### public properties #########################

    /**
     * Currently set value
     */
    public value: any;

    //######################### constructor #########################
    constructor(private _typeaheadTags: TypeaheadTagsComponent)
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
        
        this.value = value;
        this._typeaheadTags.value = value;
    }

    /**
     * Registers callback that is called when value of typeahead changes
     */
    public registerOnChange(fn: (data: any) => any): void
    {
        this._changeSubscription = this._typeaheadTags.valueChanged.subscribe(value =>
        {
            this.value = value;
            
            fn(value);
        });
    }

    /**
     * Registers callback that is called when typeahead is touched
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