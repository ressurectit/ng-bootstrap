import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Utils} from '@anglr/common';
import * as $ from 'jquery';

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
            <button type="button" class="btn btn-info" data-dismiss="modal">
                <span class="glyphicon glyphicon-ban-circle"></span>
                <span>{{dialogCancelText}}</span>
            </button>

            <button type="button" class="btn btn-primary" (click)="confirm()">
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
     * Id of confirmation dialog
     */
    public id: string = "";
    
    /**
     * Data that can be passed to confirmation
     */
    private _data: any = null;

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
    }
    public get visible(): boolean
    {
        return this._visible;
    }
    
    //######################### constructor #########################
    constructor()
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
    
    //######################### private methods #########################
    
    /**
     * Method called for confirmation
     */
    public confirm()
    {
        this._visible = false;
        this.confirmed.emit(this._data);
        this._data = null;
    }
}