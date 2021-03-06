import {Directive, ElementRef, AfterViewInit, OnDestroy, Input, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import * as $ from 'jquery';

/**
 * Directive applies (bootstrap) jQuery tooltip on all elements which have tooltip attribute specified.
 */
@Directive(
{
    selector: '[title]'
})
export class BootstrapTooltipDirective implements AfterViewInit, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Indication that current code is running in browser
     */
    private _isBrowser: boolean = false;

    /**
     * Indication whether was tooltip already initialized
     */
    private _initialized: boolean = false;
    
    /**
     * JQuery object of element on which is tooltip applied
     */
    private _jqueryElement: JQuery;
    
    /**
     * Tooltip text
     */
    private _text: string;
    
    //######################### public properties - inputs #########################
    
    /**
     * Gets or sets tooltip text
     */
    @Input("title")
    public get text(): string
    {
        return this._text;
    }
    public set text(value: string)
    {
        if(value == this._text)
        {
            return;
        }
        
        this._text = value;
        
        if(this._initialized)
        {
            this._setValue();
        }
    }

    /**
     * Indication whether tooltip allows html content
     */
    @Input()
    public htmlTooltip: boolean = false;

    /**
     * Bootstrap tooltip trigger (click | hover | focus | manual)
     * How tooltip is triggered. You may pass multiple triggers; separate them with a space. 
     * Manual cannot be combined with any other trigger.
     */
    @Input()
    public trigger: BootstrapTrigger = "hover";
    
    //######################### constructor #########################
    constructor(element: ElementRef, @Inject(PLATFORM_ID) platformId: Object)
    {
        this._isBrowser = isPlatformBrowser(platformId);

        if(this._isBrowser)
        {
            this._jqueryElement = $(element.nativeElement); 
        }
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this._setValue();
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._isBrowser)
        {
            this._jqueryElement.tooltip('destroy');
        }
    }
    
    //######################### private methods #########################
    
    /**
     * Sets current value to tooltip
     */
    private _setValue()
    {
        if(!this._isBrowser)
        {
            return;
        }

        this._jqueryElement.attr("title", this._text);
        
        if(this._initialized)
        {
            this._jqueryElement.tooltip(<any>'fixTitle');
        }
        else
        {
            this._jqueryElement.tooltip(
            {
                container: 'body',
                trigger: this.trigger,
                html: this.htmlTooltip,
                delay: { "show": 250, "hide": 0 }
            });
            
            this._initialized = true;
        }
    }
}