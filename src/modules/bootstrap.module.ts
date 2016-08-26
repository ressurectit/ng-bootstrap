import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DialogComponent} from '../components/dialog';
import {ConfirmationDialogComponent} from '../components/confirmationDialog';
import {DATETIME_PICKER_DIRECTIVES} from '../directives/datetimePicker';
import {BOOTSTRAP_SELECT_DIRECTIVES} from '../directives/bootstrapSelect';
import {BootstrapPopoverDirective, BootstrapTooltipDirective} from '../directives/misc';

/**
 * Module for bootstrap components
 */
@NgModule(
{
    imports: [CommonModule],
    declarations: [DialogComponent, ConfirmationDialogComponent, DATETIME_PICKER_DIRECTIVES, BOOTSTRAP_SELECT_DIRECTIVES, BootstrapPopoverDirective, BootstrapTooltipDirective],
    exports: [DialogComponent, ConfirmationDialogComponent, DATETIME_PICKER_DIRECTIVES, BOOTSTRAP_SELECT_DIRECTIVES, BootstrapPopoverDirective, BootstrapTooltipDirective]
})
export class BootstrapModule
{
}