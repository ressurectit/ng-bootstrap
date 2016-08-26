import {Directive, ElementRef, AfterViewInit, OnDestroy, Input} from '@angular/core';
import $ from 'tsjquery';

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
    public get text(): string
    {
        return this._text;
    }
    
    //######################### constructor #########################
    constructor(element: ElementRef)
    {
        this._jqueryElement = $(element.nativeElement); 
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
        this._jqueryElement.tooltip('destroy');
    }
    
    //######################### private methods #########################
    
    /**
     * Sets current value to tooltip
     */
    private _setValue()
    {
        this._jqueryElement.attr("title", this._text);
        
        if(this._initialized)
        {
            this._jqueryElement.tooltip('fixTitle');
        }
        else
        {
            this._jqueryElement.tooltip(
            {
                container: 'body',
                trigger: 'hover',
                delay: { "show": 250, "hide": 0 }
            });
            
            this._initialized = true;
        }
    }
}