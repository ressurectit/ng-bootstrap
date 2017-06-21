import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Utils} from '@anglr/common';

/**
 * Bootstrap modal confirmation dialog component
 */
@Component(
{
    selector: "confirmation-dialog",
    template:
   `<modal-dialog [dialogId]="id"
                  [(visible)]="visible"
                  [dialogTitle]="confirmationTitle"
                  dialogCss="modal-sm">
        <div class="dialog-body">
            <div [innerHTML]="confirmationText"></div>
        </div>

        <div class="dialog-footer">
            <button type="button" class="btn btn-info" data-dismiss="modal" #cancelButton>
                <span class="glyphicon glyphicon-ban-circle"></span>
                <span>{{dialogCancelText}}</span>
            </button>

            <button type="button" class="btn btn-primary" (click)="confirm()" #confirmButton>
                <span class="glyphicon glyphicon-ok"></span>
                <span>{{dialogConfirmText}}</span>
            </button>
        </div>
    </modal-dialog>`,
    exportAs: "confirmationDialog"
})
export class ConfirmationDialogComponent
{
    //######################### private fields #########################

    /**
     * Indication whether is dialog visible
     */
    private _visible: boolean = false;
    
    /**
     * Data that can be passed to confirmation
     */
    private _data: any = null;

    /**
     * Indication whether is code running in browser
     */
    private _isBrowser: boolean = isPlatformBrowser(this._platformId);

    //######################### public properties - template bindings #########################

    /**
     * Id of confirmation dialog
     * 
     * @internal
     */
    public id: string = "";

    /**
     * Button that is used for confirmation
     * 
     * @internal
     */
    @ViewChild('confirmButton')
    public confirmButton: ElementRef;

    /**
     * Button that is used for cancelation
     * 
     * @internal
     */
    @ViewChild('cancelButton')
    public cancelButton: ElementRef;

    //######################### public properties - inputs #########################

    /**
     * Text of confirmation dialog, allows html elements in text
     */
    @Input()
    public confirmationText: string = "";

    /**
     * Text for cancel button
     */
    @Input()
    public dialogCancelText: string = "";
    
    /**
     * Text for confirm button
     */
    @Input()
    public dialogConfirmText: string = "";
    
    /**
     * Text that is displayed as title of confirmation
     */
    @Input()
    public confirmationTitle: string = "";

    /**
     * Indicates which button should have focus, if true confirm button, otherwise cancel button
     */
    @Input()
    public confirmFocus: boolean = false;
    
    //######################### public properties - outputs #########################

    /**
     * Occurs when user confirmed dialog
     */
    @Output()
    public confirmed: EventEmitter<any> = new EventEmitter();
    
    /**
     * Occurs when user canceled confirmation
     */
    @Output()
    public canceled: EventEmitter<any> = new EventEmitter();
    
    //######################### public properties #########################
    
    /**
     * Gets or sets indication whether is confirmation dialog visible
     * 
     * @internal
     */
    public set visible(visible: boolean)
    {
        if(visible == this._visible)
        {
            return;
        }
        
        this._visible = visible;
        
        if(!visible)
        {
            this.canceled.emit(this._data);
            this._data = null;
        }
        else
        {
            this._setFocus();
        }
    }
    public get visible(): boolean
    {
        return this._visible;
    }
    
    //######################### constructor #########################
    constructor(@Inject(PLATFORM_ID) private _platformId: Object)
    {
        this.id = Utils.common.generateId(12);
    }
    
    //######################### public methods #########################
    
    /**
     * Shows confirmation dialog and stores data that are passed to confirmed event
     * @param  {any} data
     */
    public showConfirmation(data: any)
    {
        this._visible = true;
        this._data = data;
    }

    /**
     * Method called for confirmation
     * 
     * @internal
     */
    public confirm()
    {
        this._visible = false;
        this.confirmed.emit(this._data);
        this._data = null;
    }
    
    //######################### private methods #########################
    
    /**
     * Sets focus to one of buttons
     */
    private _setFocus()
    {
        if(!this._isBrowser || !this.confirmButton || !this.cancelButton)
        {
            return;
        }

        if(this.confirmFocus)
        {
            this.confirmButton.nativeElement.focus();
        }
        else
        {
            this.cancelButton.nativeElement.focus();
        }
    }
}