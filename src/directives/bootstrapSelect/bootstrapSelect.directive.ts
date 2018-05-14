import {Directive,
        Input,
        ContentChildren,
        QueryList,
        AfterViewChecked,
        AfterContentInit,
        ElementRef,
        OnDestroy,
        Renderer2,
        IterableDiffers,
        Inject,
        PLATFORM_ID,
        IterableDiffer} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {isArray, isPresent, isBlank} from '@anglr/common';
import {Subscription, Subject, Observable} from 'rxjs';
import {BootstrapSelectOptionDirective} from './bootstrapSelectOption.directive';
import * as $ from 'jquery';

/**
 * Directive that wraps bootstrap select
 */
@Directive(
{
    selector: "select.selectpicker"
})
export class BootstrapSelectDirective implements AfterViewChecked, AfterContentInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Indication that current code is running in browser
     */
    private _isBrowser: boolean = false;

    /**
     * Collection of items that are displayed in select
     */
    private _collection: any[];

    /**
     * Object monitoring collection changes
     */
    private _differ: IterableDiffer<{}>;
    
    /**
     * Subject that is used for emitting changed values
     */
    private _selectChangedSubject: Subject<any> = new Subject();
    
    /**
     * Currently set value
     */
    private _value: string;

    /**
     * Indication that current bootstrap select is disabled
     */
    private _disabled: boolean = false;

    /**
     * Subscription for changes of content options
     */
    private _contentOptionsSubscription: Subscription;

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

            this._differ = this._iterableDiffers.find(itms).create();
        }
    }

    /**
     * Indication that current bootstrap select is disabled
     */
    @Input()
    public set disabled(value: boolean)
    {
        this._disabled = value;

        this._renderer.setProperty(this._element.nativeElement, 'disabled', value);
        
        if(this._isBrowser)
        {
            this.selector.selectpicker("refresh");
        }
    }
    public get disabled(): boolean
    {
        return this._disabled;
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
     * Gets or sets value of select picker, any picker supported value
     */
    public set value(val: any)
    {
        this._value = val;

        if(!this._isBrowser)
        {
            return;
        }

        if(isBlank(val))
        {
            this.selector.selectpicker("val", val);

            return;
        }

        if(isArray(val))
        {
            val = val.map(value => this._fromValue(value));
        }
        else
        {
            val = this._fromValue(val);
        }

        this.selector.selectpicker("val", val);
    }
    public get value(): any
    {
        return this._value;
    }

    /**
     * Array of options that are in this select
     */
    @ContentChildren(BootstrapSelectOptionDirective)
    public contentOptions: QueryList<BootstrapSelectOptionDirective>;
    
    //######################### private properties #########################
    
    /**
     * Array of options that are as content in select
     */
    private get options(): BootstrapSelectOptionDirective[]
    {
        if(isBlank(this.contentOptions))
        {
            return [];
        }

        return this.contentOptions.toArray();;
    };

    /**
     * Gets jQuery object for select picker
     */
    private get selector(): JQuery
    {
        return $(this._element.nativeElement);
    }

    //######################### constructor #########################
    constructor(private _element: ElementRef,
                private _iterableDiffers: IterableDiffers,
                @Inject(PLATFORM_ID) platformId: Object,
                private _renderer: Renderer2)
    {
        this._isBrowser = isPlatformBrowser(platformId);

        if(!this._isBrowser)
        {
            return;
        }

        this.selector.selectpicker();
        this.selector.on('changed.bs.select', () =>
        {
            let val = this.selector.selectpicker("val");

            if(isArray(val))
            {
                val = val.map(value => this._toValue(value));
            }
            else
            {
                val = this._toValue(val);
            }

            this._value = val;
            this._selectChangedSubject.next(this._value);
        });
    }

    //######################### public methods - implementation of AfterViewChecked #########################

    /**
     * Runs after view was checked for changes
     */
    public ngAfterViewChecked(): any
    {
        if (isPresent(this._differ) && this._isBrowser)
        {
            var changes = this._differ.diff(this._collection);

            if (isPresent(changes))
            {
                this.refresh();
            }
        }
    }

    //######################### public methods - implementation of AfterContentInit #########################
    
    /**
     * Called when content was initialized
     */
    public ngAfterContentInit()
    {
        this._contentOptionsSubscription = this.contentOptions.changes.subscribe(() =>
        {
            this.value = this._value;
        });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._contentOptionsSubscription)
        {
            this._contentOptionsSubscription.unsubscribe();
            this._contentOptionsSubscription = null;
        }
    }

    //######################### public methods #########################

    /**
     * Refresh visuals of bootstrap select from current HTML <select>
     */
    public refresh()
    {
        if(this._isBrowser)
        {
            this.selector.selectpicker("refresh");
            this.value = this._value;
        }
    }

    //######################### private methods #########################
    
    /**
     * Convert bootstrap select value to real value
     */
    private _toValue(itm: string): any
    {
        let tmp = this.options.filter(opt => opt.id == itm);

        if(tmp.length > 0)
        {
            return tmp[0].value;
        }

        return itm;
    }

    /**
     * Converts real value to bootstrap select value
     */
    private _fromValue(val: any): string
    {
        let tmp = this.options.filter(opt => opt.isEqual(val));

        if(tmp.length > 0)
        {
            return tmp[0].id;
        }

        return val;
    }
}