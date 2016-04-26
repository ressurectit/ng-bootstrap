import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter} from 'angular2/core';
import {isBlank} from 'angular2/src/facade/lang';
import $ from 'tsjquery';

/**
 * Bootstrap modal dialog component
 */
@Component(
{
    selector: "dialog",
    template:
   `<div class="modal fade" [id]="dialogId" tabindex="-1" role="dialog">
        <div class="modal-dialog {{dialogCss}}" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" >
                        <span>&times;</span>
                    </button>

                    <h4 class="modal-title">{{dialogTitle}}</h4>
                </div>

                <div class="modal-body">
                    <ng-content select=".dialog-body"></ng-content>
                </div>

                <div class="modal-footer">
                    <ng-content select=".dialog-footer"></ng-content>
                </div>
            </div>
        </div>
    </div>`
})
export class DialogComponent implements OnInit, AfterViewInit
{
    //######################### private fields #########################
    
    /**
     * Indication whether is dialog visible
     */
    private _visible: boolean = false;
    
    //######################### public properties - inputs #########################
    
    /**
     * Id of dialog
     */
    @Input()
    public dialogId: string;
    
    /**
     * Title of displayed dialog
     */
    @Input()
    public dialogTitle: string = "";
    
    /**
     * Modal dialog extra css classes
     */
    @Input()
    public dialogCss: string = "";
    
    /**
     * Gets or sets indication whether is dialog visible
     */
    @Input()
    public set visible(visible: boolean)
    {
        if(visible == this._visible)
        {
            return;
        }
        
        let dialog = $(this.dialogSelector); 
        
        if(visible)
        {
            dialog.modal("show");
        }
        else
        {
            dialog.modal("hide");
        }
        
        this._visible = visible;
    }
    public get visible(): boolean
    {
        return this._visible;
    }
    
    //######################### public properties - outputs #########################
    
    /**
     * Occurs when visiblity of dialog changes
     */
    @Output()
    public visibleChange: EventEmitter<boolean> = new EventEmitter();
    
    //######################### private properties #########################
    
    /**
     * Gets dialog selector string
     */
    private get dialogSelector(): string
    {
        return `#${this.dialogId}`;
    }
    
    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(isBlank(this.dialogId))
        {
            throw new Error("You must set id of dialog.");
        }
    }
   
    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        $(this.dialogSelector).on('hidden.bs.modal', e => 
        {
            this._visible = false
            this.visibleChange.emit(false);
        });
    }
}