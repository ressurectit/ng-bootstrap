import {Directive, OnDestroy, OnInit, ElementRef, Input, PLATFORM_ID, Inject, EventEmitter, Output} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {isBlank} from '@anglr/common';
import * as $ from 'jquery';

@Directive(
{
    selector: 'input[type="checkbox"][bootstrap-switch],input[type="radio"][bootstrap-switch]'
})
export class BootstrapSwitchDirective implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Indication whether is application initialized
     */
    private _initialized = false;

    /**
     * Current value of switch
     */
    private _value: boolean;

    /**
     * Indication whether is code running in browser
     */
    private _isBrowser: boolean = isPlatformBrowser(this._platformId);

    //######################### public properties - inputs #########################

    /**
     * Gets or sets current value of switch
     */
    @Input()
    public get value(): boolean
    {
        return this._value;
    }
    public set value(value: boolean)
    {
        this._value = value || false;

        if(this._initialized && this._isBrowser)
        {
            $(this._element.nativeElement).bootstrapSwitch('state', this._value, true);
        }
    }

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

    //######################### public properties - outputs #########################

    /**
     * Gets event emitter that is trigerred when value changes
     */
    @Output()
    public valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

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
        let options = 
        {
            'onSwitchChange': (_event, state) =>
            {
                this.valueChanged.emit(state);
            }
        };

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

        if(isBlank(this._value))
        {
            this._value = false;
        }
        else
        {
            options['state'] = this._value;
        }

        if(this._isBrowser)
        {
            $(this._element.nativeElement).bootstrapSwitch(options);
        }

        this._initialized = true;
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