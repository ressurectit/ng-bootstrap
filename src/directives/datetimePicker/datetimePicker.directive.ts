import {Directive, ElementRef, OnInit, OnDestroy, Attribute, Input, EventEmitter, Output, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {GlobalizationService, isPresent} from '@anglr/common';
import {Observable, BehaviorSubject, Subscription} from 'rxjs';
import {Datetimepicker} from 'eonasdan-bootstrap-datetimepicker';
import * as $ from 'jquery';


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
     * Indication that current code is running in browser
     */
    private _isBrowser: boolean = false;

    /**
     * Private value used on server side
     */
    private _value: moment.Moment;

    /**
     * Indication that value was first time set
     */
    private _firstSetValue: boolean = false;

    /**
     * Subscription for globalization changes
     */
    private _globalizationSubscription: Subscription = null;

    /**
     * Subject that is used for emitting changed values
     */
    private _pickerChangedSubject: BehaviorSubject<moment.Moment> = new BehaviorSubject<moment.Moment>(null);

    //######################### public properties - input #########################

    /**
     * Moment js format of datetimer picker
     */
    @Input()
    public set format(value: string)
    {
        if (this._isBrowser)
        {
            this.pickerObj.format(value);
            this.pickerObj.viewMode("days");
        }
    }

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
        if (value && this._isBrowser)
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
        if (value && this._isBrowser)
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
        let maxDate = this.pickerObj.maxDate();
        let minDate = this.pickerObj.minDate();
        let changed = false;

        if(isPresent(val))
        {
            //value that is set is greater than max date
            if(maxDate && maxDate < val)
            {
                val = maxDate;

                changed = true;
            }

            //value that is set is lesser than min date
            if(minDate && minDate > val)
            {
                val = minDate;

                changed = true;
            }
        }

        if(changed)
        {
            this._emitIfInternalIsSame(val);
        }
        else if(!this._firstSetValue)
        {
            this._pickerChangedSubject.next(val);
        }

        this._value = val;

        if(this._isBrowser)
        {
            this.pickerObj.date(val);
        }

        this._firstSetValue = true;
    }
    public get value(): any
    {
        if(this._isBrowser)
        {
            return this.pickerObj.date() || null;
        }

        return this._value;
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
    private get pickerObj(): Datetimepicker
    {
        return this.selector.data("DateTimePicker");
    }

    //######################### constructor #########################
    constructor(private _element: ElementRef,
                @Attribute("type") type: string,
                globalizationService: GlobalizationService,
                @Inject(PLATFORM_ID) platformId: Object)
    {
        if(!(globalizationService instanceof GlobalizationService))
        {
            throw new Error("Provided 'DatetimepickerGlobalizationService' is not implementation of 'DatetimepickerGlobalizationService'");
        }

        this._isBrowser = isPlatformBrowser(platformId);

        if(!this._isBrowser)
        {
            return;
        }

        this.locale = globalizationService.locale;

        this._globalizationSubscription = globalizationService.localeChange.subscribe(() =>
        {
            this.locale = globalizationService.locale;
            this.pickerObj.locale(globalizationService.locale);
        });

        this.selector.datetimepicker(
        {
            locale: this.locale
        });

        if(type == "datetime")
        {
            this.format = "L LT";
        }
        else
        {
            this.format = "L";
        }
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        if(!this._isBrowser)
        {
            return;
        }

        if(this.linkWith)
        {
            this.pickerObj.useCurrent(false);
            this.linkWith.pickerObj.useCurrent(false);
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
    public ngOnDestroy(): void
    {
        if(this._globalizationSubscription)
        {
            this._globalizationSubscription.unsubscribe();
            this._globalizationSubscription = null;
        }
    }

    //######################### public methods #########################

    /**
     * Toggles visibility of date time picker
     */
    public toggle(): void
    {
        if(this._isBrowser)
        {
            this.pickerObj.toggle();
        }
    }

    //######################### private methods #########################

    /**
     * Emits internal change of value based on mix/max date
     * @param val Current value that is checked
     */
    private _emitIfInternalIsSame(val: moment.Moment)
    {
        if(val.diff(this.pickerObj.date()) === 0)
        {
            this._pickerChangedSubject.next(val);
            this.dateChange.emit(val);
        }
    }
}