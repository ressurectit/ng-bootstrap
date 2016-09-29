import {Directive, ElementRef, AfterViewInit, OnDestroy, Input} from '@angular/core';
import * as $ from 'jquery';

/**
 * Directive applies (bootstrap) jQuery popover on all elements which have popover attribute specified.
 */
@Directive(
{
    selector: '[popover]'
})
export class BootstrapPopoverDirective implements AfterViewInit, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * JQuery object of element on which is tooltip applied
     */
    private _jqueryElement: JQuery;

    //######################### public properties - inputs #########################

    /**
     * Gets or sets popover HTML content CSS selector
     */
    @Input("popover")
    public contentSelector: string;

    /**
     * Gets or sets popover placement location valid values (top, bottom, left, right, auto)
     */
    @Input("popoverPlacement")
    public contentPosition: string = "auto";

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
        this._jqueryElement.popover({
            html: true,
            content: () => 
            {
                return $(this.contentSelector).html();    
            },
            animation: true,
            placement: this.contentPosition,
            template: `<div class="popover popover-large" role="tooltip">
                           <div class="arrow"></div>                           
                           <div class="popover-content"></div>
                       </div>`
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._jqueryElement.popover('destroy');
    }
}