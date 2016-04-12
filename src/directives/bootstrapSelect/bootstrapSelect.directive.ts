import {Directive,
        Input,
        AfterViewChecked,
        ElementRef,
        ChangeDetectorRef,
        IterableDiffers,
        IterableDiffer} from 'angular2/core';
import {isPresent, isArray, isBlank} from 'angular2/src/facade/lang';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import $ from 'tsjquery';

/**
 * Directive that wraps bootstrap select
 */
@Directive(
{
    selector: "select.selectpicker"
})
export class BootstrapSelectDirective implements AfterViewChecked
{
    //######################### private fields #########################

    /**
     * Collection of items that are displayed in select
     */
    private _collection: any[];

    /**
     * Object monitoring collection changes
     */
    private _differ: IterableDiffer;
    
    /**
     * Subject that is used for emitting changed values
     */
    private _selectChangedSubject: Subject<any> = new Subject();
    
    /**
     * Currently set value
     */
    private _value: string;

    //######################### public properties - inputs #########################

    /**
     * Sets collection of tracked items
     */
    @Input("trackCollection")
    public set collection(itms: any[])
    {
        this._collection = itms;

        if (isBlank(this._differ) && isPresent(itms))
        {
            if(!isArray(itms))
            {
                throw new Error("Parameters supplied for bootstrap-select trackCollection is not an array.");
            }

            this._differ = this._iterableDiffers.find(itms).create(this._changeDetector);
        }
    }
    
    //######################### public properties #########################
    
    /**
     * Gets observable that is trigerred when select value changed
     */
    public get selectChanged(): Observable<any>
    {
        return this._selectChangedSubject.asObservable();
    }
    
    /**
     * Gets or sets value of datetime picker, any picker supported value
     */
    public set value(val: any)
    {
        this._value = val;
        this.selector.selectpicker("val", val);
    }
    public get value(): any
    {
        return this.selector.selectpicker("val");
    }
    
    //######################### private properties #########################
    
    /**
     * Gets jQuery object for datetime picker
     */
    private get selector(): JQuery
    {
        return $(this._element.nativeElement);
    }

    //######################### constructor #########################
    constructor(private _element: ElementRef,
                private _changeDetector: ChangeDetectorRef,
                private _iterableDiffers: IterableDiffers)
    {

        this.selector.selectpicker();
        this.selector.on('changed.bs.select', () =>
        {
            this.value = this.selector.selectpicker("val");
            this._selectChangedSubject.next(this.value);
        });
    }

    //######################### public methods - implementation of AfterViewChecked #########################

    /**
     * Runs after view was checked for changes
     */
    public ngAfterViewChecked(): any
    {
        if (isPresent(this._differ))
        {
            var changes = this._differ.diff(this._collection);

            if (isPresent(changes))
            {
                this.selector.selectpicker("refresh");
                this.value = this._value;
            }
        }
    }
}