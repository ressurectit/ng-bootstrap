import {Directive, ElementRef, OnInit, Input, PLATFORM_ID, Inject, HostListener, HostBinding, OnDestroy} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {isPresent, isBlank, isJsObject, isFunction} from '@jscrpt/common';
import {Subject, Observable} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import * as $ from 'jquery';
import * as Handlebars from 'handlebars';

//TODO - tooltip if no value selected and text inserted

/**
 * Directive that is used for creating autocomplete (typeahead.js) on input
 */
@Directive(
{
    selector: 'input[typeahead]'
})
export class TypeaheadDirective implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Indication that current code is running in browser
     */
    private _isBrowser: boolean = isPlatformBrowser(this._platformId);

    /**
     * Currently selected value
     */
    private _value: any = null;
    
    /**
     * Indication that component is initialized
     */
    private _initialized: boolean = false;

    /**
     * Subject that is used for emitting changes
     */
    private _valueChangeSubject: Subject<any> = new Subject();
    
    /**
     * Subject that is used for emitting changes for model binding
     */
    private _externalValueChangeSubject: Subject<any> = new Subject();

    /**
     * Subject that is used for emitting selection of value from options
     */
    private _externalValueSelectedSubject: Subject<any> = new Subject();

    /**
     * Gets jQuery object for typeahead autocomplete
     */
    private _selector: JQuery;

    //######################### public properties - input #########################

    /**
     * Indication that also non existing value from options will be accepted as value, it is always as string value
     */
    @Input()
    public freeInput: boolean = false;

    /**
     * Maximal number of displayed items
     */
    @Input()
    public typeaheadMaxItems: number = 100;

    /**
     * Minimal number of characters to start search
     */
    @Input()
    public typeaheadMinLength: number = 2;

    /**
     * Name of displayed property as selected value
     */
    @Input()
    public typeaheadDisplayedProperty: string|((suggestion: any) => string)|null = null;
    
    /**
     * Name of property that is used for extracting value from object
     */
    @Input()
    public typeaheadValueProperty: string|null = null;

    /**
     * Debounce time that indicates after which time of idle perform search
     */
    @Input()
    public typeaheadDebounceTime: number = 400;

    /**
     * Template that is used for suggestion, using handlebar syntax
     */
    @Input()
    public typeaheadTemplate: string|null = null;

    /**
     * Function that is called to obtain data for search
     */
    @Input()
    public typeaheadSource: ((query: any) => Observable<any>)|null = null;

    //######################### public properties - host #########################

    /**
     * Css class that is applied to input if no value is selected
     */
    @HostBinding('class.no-typeahead-value')
    public noValueCssClass: boolean = false;

    //######################### public properties #########################

    /**
     * Gets or sets currently set value
     */
    public get value(): any
    {
        return this._value;
    }
    public set value(val: any)
    {
        this._value = val;

        if(this._initialized)
        {
            val = val || "";
            
            if(isPresent(val) && isPresent(this.typeaheadDisplayedProperty) && isJsObject(val) && isBlank(this.typeaheadValueProperty))
            {
                if(isFunction(this.typeaheadDisplayedProperty))
                {
                    val = (this.typeaheadDisplayedProperty as (suggestion: any) => any)(val);
                }
                else
                {
                    val = val[this.typeaheadDisplayedProperty as string] || "";
                }
            }
            
            if(this._isBrowser)
            {
                this._selector.typeahead("val", val);
            }
        }
    }
    
    /**
     * Gets observable that emits selection of item from options
     */
    public get valueSelected(): Observable<any>
    {
        return this._externalValueSelectedSubject.asObservable();
    }

    /**
     * Gets observable that emits changes of value
     */
    public get valueChanged(): Observable<any>
    {
        return this._externalValueChangeSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(element: ElementRef, @Inject(PLATFORM_ID) private _platformId: Object)
    {
        if(this._isBrowser)
        {
            this._selector = $(element.nativeElement);
        }
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(!this.typeaheadSource)
        {
            throw new Error("You must specify 'typeaheadSource' function.");
        }

        if(!this._isBrowser)
        {
            return;
        }

        this._valueChangeSubject
            .pipe(debounceTime(this.typeaheadDebounceTime))
            .subscribe((queryAsync: any) =>
            {
                this.typeaheadSource(queryAsync.query)
                    .subscribe(data =>
                    {
                        queryAsync.async(data);
                    });
            });

        let datasetOptions =
        {
            limit: this.typeaheadMaxItems,
            source: (query, sync, async) =>
            {
                this._valueChangeSubject.next({query: query, async: async, sync: sync});
            }
        };

        if(isPresent(this.typeaheadDisplayedProperty))
        {
            datasetOptions["display"] = this.typeaheadDisplayedProperty;
        }

        if(isPresent(this.typeaheadTemplate))
        {
            datasetOptions["templates"] = {};
            datasetOptions["templates"].suggestion = Handlebars.compile(this.typeaheadTemplate);
        }

        this._selector
            .typeahead(
            {
                minLength: this.typeaheadMinLength,
                highlight: true
            }, datasetOptions)
            .on("typeahead:select", (_event, suggestion) =>
            {
                this._setValue(suggestion);
            })
            .on("typeahead:autocomplete", (_event, suggestion) =>
            {
                this._setValue(suggestion);
            });
            
            this._initialized = true;
            this.value = this._value;
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._isBrowser)
        {
            this._selector.typeahead('destroy');
        }
    }

    //######################### public methods - host #########################

    /**
     * Called when 'input' event occurs on input element
     * @param value Changed value
     */
    @HostListener('input', ['$event.target.value'])
    public inputChange(value: string)
    {
        //no free input allowed, set css class
        if(!this.freeInput)
        {
            this.noValueCssClass = !!value;
            this._value = null;
            this._externalValueChangeSubject.next(null);
        }
        //free input allowed
        else
        {
            this.value = value;
            this._externalValueChangeSubject.next(value);
        }

        //TODO - use stored data for change event, written text match existing value, use it
        // this.value = this._toValue(value);
        // this._externalValueChangeSubject.next(this.value);
    }
    
    //######################### private methods #########################

    /**
     * Sets selected value 
     * @param suggestion Suggestion that was selected or auto completed
     */
    private _setValue(suggestion)
    {
        this.noValueCssClass = false;
        this.value = this._toValue(suggestion);
        this._externalValueChangeSubject.next(this.value);
        this._externalValueSelectedSubject.next(this.value);
    }

    /**
     * Converts val from suggestion to value of directive
     * @param val Val to be converted
     */
    private _toValue(val: any)
    {
        var result = val;
        
        if(isPresent(val) && isPresent(this.typeaheadValueProperty))
        {
            result = val[this.typeaheadValueProperty];
        }
        
        return result;
    }
}
