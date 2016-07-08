import {Directive, ElementRef, OnInit, OnDestroy, Attribute, Input, Optional, EventEmitter, Output} from '@angular/core';
import {DatetimePickerGlobalizationService} from './datetimePickerGlobalization.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import $ from 'tsjquery';

/**
 * Directive that is used for creating date/datetimepicker
 */
@Directive(
{
    selector: 'input.datetimepicker',
    exportAs: "dateTimePicker"
})
export class DatetimePickerDirective implements OnInit, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Subscription for globalization changes
     */
    private _globalizationSubscription: Subscription = null;
    
    /**
     * Subject that is used for emitting changed values
     */
    private _pickerChangedSubject: Subject<moment.Moment> = new Subject<moment.Moment>();
    
    //######################### public properties - input #########################

    /**
     * Moment js format of datetimer picker
     */
    @Input()
    public format: string;
    
    /**
     * Moment js locale that will set format of date time
     */
    @Input()
    public locale: string;
    
    /**
     * Object of other datetime picker which will be linked with this, set only on second one (containing higher value)
     */
    @Input() 
    public linkWith: DatetimePickerDirective;
    
    /**
     * Minimum date that is allowed to enter
     */
    @Input()
    public set minDate(value: moment.Moment) 
    {
        if (value) 
        {
            this.pickerObj.minDate(value);
        }
    }    
    
    /**
     * Maximum date that is allowed to enter
     */
    @Input()
    public set maxDate(value: moment.Moment)
    {
        if (value) 
        {
            this.pickerObj.maxDate(value);
        }
    }
    
    //######################### public properties - outputs #########################
    
    /**
     * Output event that is triggered when value of picker has changed
     */
    @Output()
    public dateChange: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
    
    //######################### public properties #########################
    
    /**
     * Gets observable that is trigerred when picker value changed
     */
    public get pickerChanged(): Observable<moment.Moment>
    {
        return this._pickerChangedSubject.asObservable();
    }
    
    /**
     * Gets or sets value of datetime picker, any picker supported value
     */
    public set value(val: any)
    {
        this.pickerObj.date(val);
    }
    public get value(): any
    {
        return this.pickerObj.date() || null;
    }
    
    //######################### private properties #########################
    
    /**
     * Gets jQuery object for datetime picker
     */
    private get selector(): JQuery
    {
        return $(this._element.nativeElement);
    }
    
    /**
     * Gets object of datetime picker
     */
    private get pickerObj(): BootstrapV3DatetimePicker.Datetimepicker
    {
        return this.selector.data("DateTimePicker");
    }

    //######################### constructor #########################
    constructor(private _element: ElementRef,
                @Attribute("type") type: string,
                @Optional() datetimepickerGlobalizationService: DatetimePickerGlobalizationService)
    {
        if(datetimepickerGlobalizationService)
        {
            if(!(datetimepickerGlobalizationService instanceof DatetimePickerGlobalizationService))
            {
                throw new Error("Provided 'DatetimepickerGlobalizationService' is not implementation of 'DatetimepickerGlobalizationService'");
            }
            
            this.locale = datetimepickerGlobalizationService.getLocale();
            
            this._globalizationSubscription = datetimepickerGlobalizationService.getLocaleChange().subscribe(locale => 
            {
                this.locale = locale;
                this.pickerObj.locale(locale);
            })
        }
        
        if(type == "datetime")
        {
            this.format = "L LT";
        }
        else
        {
            this.format = "L";
        }
        
        this.selector.datetimepicker(
        {
            locale: this.locale
        });
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(this.format)
        {
            this.pickerObj.format(this.format);
        }
        
        if(this.linkWith)
        {
            this.pickerObj.useCurrent(false);
        }               
        
        this.selector.on("dp.change", event =>
        {
            if(this.linkWith)
            {
                this.linkWith.pickerObj.maxDate(event.date);
            }
            
            this._pickerChangedSubject.next(event.date || null);
            this.dateChange.emit(event.date || null);
        });
        
        if(this.linkWith)
        {
            this.linkWith.selector.on("dp.change", event =>
            {
                this.pickerObj.minDate(event.date);
            });
        }
    }
    
    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._globalizationSubscription)
        {
            this._globalizationSubscription.unsubscribe();
            this._globalizationSubscription = null;
        }
    }
}