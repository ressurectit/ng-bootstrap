import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {DialogComponent} from '../dialog';
import utils from 'ng2-common/utils';
import $ from 'tsjquery';

/**
 * Bootstrap modal confirmation dialog component
 */
@Component(
{
    selector: "confirmation-dialog",
    template:
   `<dialog [dialogId]="_id"
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

            <button type="button" class="btn btn-primary" (click)="_confirm()">
                <span class="glyphicon glyphicon-ok"></span>
                <span>{{dialogConfirmText}}</span>
            </button>
        </div>
    </dialog>`,
    directives: [DialogComponent]
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
    private _id: string = "";

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
     * Gets or sets indication whether is confirmation dialog visible
     */
    @Input()
    public set visible(visible: boolean)
    {
        if(visible == this._visible)
        {
            return;
        }
        
        this.visibleChange.emit(visible);
        
        if(!visible)
        {
            this.confirmationChange.emit(false);
        }
    }
    public get visible(): boolean
    {
        return this._visible;
    }

    //######################### public properties - outputs #########################

    /**
     * Occurs when confirmation is changed, passing result
     */
    @Output()
    public confirmationChange: EventEmitter<boolean> = new EventEmitter();
    
    /**
     * Occurs when visiblity of dialog changes
     */
    @Output()
    public visibleChange: EventEmitter<boolean> = new EventEmitter();

    //######################### constructor #########################
    constructor()
    {
        this._id = utils.common.generateId(12);
    }
    
    //######################### private methods #########################
    
    /**
     * Method called for confirmation
     */
    private _confirm()
    {
        this._visible = false;
        this.visibleChange.emit(false);
        this.confirmationChange.emit(true);
    }
}