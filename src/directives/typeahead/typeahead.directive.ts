import {Directive, ElementRef, OnInit, Input} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {isPresent, isBlank, isJsObject} from '@anglr/common';
import * as $ from 'jquery';
import * as Handlebars from 'handlebars';

/**
 * Directive that is used for creating autocomplete (typeahead.js) on input
 */
@Directive(
{
    selector: 'input[typeahead]'
})
export class TypeaheadDirective implements OnInit
{
    //######################### private fields #########################

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
     * Gets jQuery object for typeahead autocomplete
     */
    private _selector: JQuery;

    //######################### public properties - input #########################

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
    public typeaheadDisplayedProperty: string = null;
    
    /**
     * Name of property that is used for extracting value from object
     */
    @Input()
    public typeaheadValueProperty: string = null;

    /**
     * Debounce time that indicates after which time of idle perform search
     */
    @Input()
    public typeaheadDebounceTime: number = 400;

    /**
     * Template that is used for suggestion, using handlebar syntax
     */
    @Input()
    public typeaheadTemplate: string = null;

    /**
     * Function that is called to obtain data for search
     */
    @Input()
    public typeaheadSource: (query) => Observable<any> = null;

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
                val = val[this.typeaheadDisplayedProperty] || "";
            }
            
            this._selector.typeahead("val", val);
        }
    }
    
    /**
     * Gets observable that emits changes of value
     */
    public get valueChanged(): Observable<any>
    {
        return this._externalValueChangeSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(element: ElementRef)
    {
        this._selector = $(element.nativeElement);
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

        this._valueChangeSubject
            .debounceTime(this.typeaheadDebounceTime)
            .subscribe((queryAsync: any) =>
            {
                this.typeaheadSource(queryAsync.query)
                    .subscribe(data =>
                    {//TODO - store data and use them for change event
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
            .on("typeahead:select", (event, suggestion) =>
            {
                this.value = this._toValue(suggestion);
                this._externalValueChangeSubject.next(this.value);
            })
            .on("typeahead:autocomplete", (event, suggestion) =>
            {
                this.value = this._toValue(suggestion);
                this._externalValueChangeSubject.next(this.value);
            }).on("typeahead:change", (event, value) =>
            {
                //nothing selected value
                if(!value)
                {
                    this.value = "";
                    this._externalValueChangeSubject.next("");

                    return;
                }

                //TODO - use stored data for change event
                // this.value = this._toValue(value);
                // this._externalValueChangeSubject.next(this.value);
            });
            
            this._initialized = true;
            this.value = this._value;
    }
    
    //######################### private methods #########################
    
    /**
     * Converts val from suggestion to value of directive
     * @param  {any} val Val to be converted
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
