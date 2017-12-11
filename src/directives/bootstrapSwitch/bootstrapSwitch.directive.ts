import {Directive, OnDestroy, OnInit, ElementRef, Input, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import * as $ from 'jquery';

@Directive(
{
    selector: 'input[type="checkbox"][bootstrap-switch],input[type="radio"][bootstrap-switch]'
})
export class BootstrapSwitchDirective implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Indication whether is code running in browser
     */
    private _isBrowser: boolean = isPlatformBrowser(this._platformId);

    //######################### public properties - inputs #########################

    /**
     * Text of the left side of the switch, checkbox is checked
     */
    @Input()
    public onText: string;

    /**
     * Text of the right side of the switch, checkbox is unchecked
     */
    @Input()
    public offText: string;

    /**
     * Css class that is applied to left side of the switch (on state), this css class is as suffix for bootstrap-switch-*, defined bootstrap classes default, primary, info, warning, success, danger
     */
    @Input()
    public onCssClass: string;

    /**
     * Css class that is applied to right side of the switch (off state), this css class is as suffix for bootstrap-switch-*, defined bootstrap classes default, primary, info, warning, success, danger
     */
    @Input()
    public offCssClass: string;

    //######################### constructor #########################
    constructor(private _element: ElementRef,
                @Inject(PLATFORM_ID) private _platformId: Object)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        let options = {};

        if(this.onText)
        {
            options['onText'] = this.onText;
        }

        if(this.offText)
        {
            options['offText'] = this.offText;
        }

        if(this.onCssClass)
        {
            options['onColor'] = this.onCssClass;
        }

        if(this.offCssClass)
        {
            options['offColor'] = this.offCssClass;
        }

        if(this._isBrowser)
        {
            $(this._element.nativeElement).bootstrapSwitch(options);
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._isBrowser)
        {
           $(this._element.nativeElement).bootstrapSwitch('destroy');
        }
    }
}