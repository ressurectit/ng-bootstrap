import {Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ViewChild, ContentChild, TemplateRef, AfterViewInit, ChangeDetectorRef} from "@angular/core";
import {extend, isString, isPresent, isJsObject, isFunction} from "@jscrpt/common";
import {Subject, Observable, Subscription} from "rxjs";

import {TypeaheadDirective} from "../../directives/typeahead";

/**
 * Description of css classes that are applied to TypeaheadTagsComponent
 */
export interface TypeaheadTagsCssClasses
{
    /**
     * Classes applied to typeahead input
     */
    typeaheadClasses?: {[className: string]: true};
    
    /**
     * Main content div css class
     */
    mainClass?: string;

    /**
     * Tag css class 
     */
    tagClass?: string;

    /**
     * Tag content css class
     */
    tagContentClass?: string;

    /**
     * Class for remove button (link)
     */
    removeClass?: string;
}

/**
 * Component that is used for creating autocomplete (typeahead.js) with tags
 */
@Component(
{
    selector: 'div[typeaheadtags]',
    template:
    `<div class="{{cssClasses?.mainClass}}">
        <div *ngFor="let tag of value; let index=index" class="{{cssClasses?.tagClass}}">
            <ng-template [ngIf]="!tagContentTemplate" [ngIfElse]="customTagContent">
                <div class="{{cssClasses?.tagContentClass}}">{{getTagDisplayedValue(tag)}}</div>
            </ng-template>

            <ng-template #customTagContent>
                <ng-container *ngTemplateOutlet="tagContentTemplate; context: {$implicit: tag}"></ng-container>
            </ng-template>

            <a class="{{cssClasses?.removeClass}}" (click)="removeTag(index)">x</a>
        </div>

        <span [class.hidden]="value?.length >= maxValues">
            <input typeahead
                   [attr.disabled]="tagsDisabled ? 'disabled' : null"
                   (keypress)="handleKeyPress($event.charCode || $event.keyCode)"
                   (keydown)="handleKeyDown($event)"
                   [ngClass]="cssClasses?.typeaheadClasses"
                   [placeholder]="placeholder"
                   [freeInput]="freeInput"
                   [typeaheadMaxItems]="typeaheadMaxItems"
                   [typeaheadMinLength]="typeaheadMinLength"
                   [typeaheadDisplayedProperty]="typeaheadDisplayedProperty"
                   [typeaheadValueProperty]="typeaheadValueProperty"
                   [typeaheadDebounceTime]="typeaheadDebounceTime"
                   [typeaheadTemplate]="typeaheadTemplate"
                   [typeaheadSource]="typeaheadSource">
        </span>
    </div>`,
    styles:
    [
        `.default-main
        {
            display: flex;
            flex-wrap: wrap;
        }

        .hidden
        {
            display: none;
        }

        .default-tag
        {
            margin-right: 6px;
            margin-bottom: 4px;
            background-color: #337ab7;
            padding: 0 4px;
            border-radius: 4px;
            color: #EEEEEE;
        }

        .default-tag-content
        {
            display: inline-block;
        }

        .default-remove-tag
        {
            cursor: pointer;
            color: #EEEEEE;
            font-weight: bold;
        }

        .default-remove-tag:hover
        {
            text-decoration: none;
            color: #D0D0D0;
        }
        
        .default-typeahead
        {
            border: none;
            outline: none;
            padding: 0;
            width: 300px;
            margin-bottom: 4px;
        }`
    ],
    host:
    {
        "[attr.disabled]": "tagsDisabled ? 'disabled' : null"
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeaheadTagsComponent implements OnInit, OnDestroy, AfterViewInit
{
    //######################### private fields #########################

    /**
     * Css classes applied to inner elements
     */
    private _cssClasses: TypeaheadTagsCssClasses;

    /**
     * Subject that is used for emitting changes for model binding
     */
    private _externalValueChangeSubject: Subject<any[]> = new Subject();

    /**
     * Subscription for selection changes
     */
    private _selectionChangesSubscription: Subscription;

    /**
     * Array of serialized values, used for comparison
     */
    private _serializedValues: string[] = [];

    /**
     * Currently set value
     */
    private _value: any[];

    //######################### public properties - input #########################

    /**
     * Function that is used for serialization
     */
    @Input()
    public serializationFn: (item: any) => string;

    /**
     * Indication whether duplicates are allowed
     */
    @Input()
    public allowDuplicates: boolean = false;

    /**
     * Count of maximal number of values contained in this input
     */
    @Input()
    public maxValues: number = 10;

    /**
     * Indication whether item should be removed on backspace
     */
    @Input()
    public removeOnBackspace: boolean = true;

    // /**
    //  * Optional confirmation key codes, tab is default and non changeable
    //  */
    // @Input()
    // public confirmKeys: number[] = [13];

    /**
     * Placeholder for typeahead input
     */
    @Input()
    public placeholder: string;

    /**
     * Css classes applied to inner elements
     */
    @Input()
    public cssClasses: TypeaheadTagsCssClasses = {};

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

    /**
     * Indication that this component should be tagsDisabled
     */
    @Input()
    public tagsDisabled: boolean = false;

    //######################### public properties - children #########################

    /**
     * Typeahead directive instance
     */
    @ViewChild(TypeaheadDirective)
    public typeahead: TypeaheadDirective;

    /**
     * Custom template for tag content
     */
    @ContentChild(TemplateRef)
    public tagContentTemplate: TemplateRef<any>;

    //######################### public properties #########################

    /**
     * Gets or sets currently set value
     */
    public set value(value: any[])
    {
        this._value = value || [];
        this._serializedValues = [];

        this._value.forEach(itm => this._serializedValues.push(this.serializationFn(itm)));
        this._changeDetector.detectChanges();
    }
    public get value(): any[]
    {
        return this._value;
    }
    
    /**
     * Gets observable that emits changes of value
     */
    public get valueChanged(): Observable<any[]>
    {
        return this._externalValueChangeSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef)
    {
        this._cssClasses = 
        {
            typeaheadClasses: {'default-typeahead': true},
            mainClass: 'default-main',
            tagClass: 'default-tag',
            tagContentClass: 'default-tag-content',
            removeClass: 'default-remove-tag'
        };

        this.serializationFn = itm => JSON.stringify(itm);
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this.cssClasses = extend(this._cssClasses, this.cssClasses);
    }

    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this._selectionChangesSubscription = this.typeahead.valueSelected.subscribe(value =>
        {
            this._addValue(value);
        });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._selectionChangesSubscription)
        {
            this._selectionChangesSubscription.unsubscribe();
            this._selectionChangesSubscription = null;
        }
    }

    //######################### public methods - template events/bindings #########################

    /**
     * Process confirmation keys
     * @param keyCode Code of key that was pressed
     */
    public handleKeyPress(keyCode: number)
    {
        //Process enter confirm key
        if(keyCode == 13)
        {
            let value = this.typeahead.value;

            //value exists
            if(!!value)
            {
                this._addValue(value);
            }
        }
    }

    /**
     * Process key down
     * @param event Event that occured
     */
    public handleKeyDown(event: KeyboardEvent)
    {
        if(this.removeOnBackspace && event.keyCode == 8 && !(event.target as HTMLInputElement).value)
        {
            this.removeTag(this.value.length - 1);
        }
    }

    /**
     * Removes tag at specified index
     * @param index Index of tag to be removed
     */
    public removeTag(index)
    {
        if(this.tagsDisabled)
        {
            return;
        }

        if(this._serializedValues.length != this.value.length)
        {
            throw new Error('You cant change content of typeahead tags array value, you must change whole array itself!');
        }

        this._serializedValues.splice(index, 1);
        this.value.splice(index, 1);
        this._externalValueChangeSubject.next(this.value);
        this._changeDetector.detectChanges();
    }

    /**
     * Gets displayed value for tag
     * @param value Tag value that is going to be displayed 
     */
    public getTagDisplayedValue(value)
    {
        if(isString(value))
        {
            return value;
        }

        if(isPresent(this.typeaheadDisplayedProperty) && isJsObject(value))
        {
            if(isFunction(this.typeaheadDisplayedProperty))
            {
                return (this.typeaheadDisplayedProperty as (suggestion: any) => any)(value);
            }
            else
            {
                return value[this.typeaheadDisplayedProperty as string] || "";
            }
        }

        return "";
    }

    //######################### private methods #########################

    /**
     * Adds value to control
     * @param value Value to be added
     */
    private _addValue(value)
    {
        if(this._serializedValues.length != this.value.length)
        {
            throw new Error('You cant change content of typeahead tags array value, you must change whole array itself!');
        }

        let serializedVal = this.serializationFn(value);
        let duplicate = this._serializedValues.indexOf(serializedVal) >= 0;
        
        if(!duplicate || (duplicate && this.allowDuplicates))
        {
            this._serializedValues.push(serializedVal);
            this.value.push(value);
            this._externalValueChangeSubject.next(this.value);
        }

        this.typeahead.value = null;
        this._changeDetector.detectChanges();
    }
}