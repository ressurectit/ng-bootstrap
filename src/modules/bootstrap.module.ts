import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DialogComponent} from '../components/dialog';
import {ConfirmationDialogComponent} from '../components/confirmationDialog';
import {DATETIME_PICKER_DIRECTIVES} from '../directives/datetimePicker';
import {BOOTSTRAP_SELECT_DIRECTIVES} from '../directives/bootstrapSelect';

/**
 * Module for bootstrap components
 */
@NgModule(
{
    imports: [CommonModule],
    declarations: [DialogComponent, ConfirmationDialogComponent, DATETIME_PICKER_DIRECTIVES, BOOTSTRAP_SELECT_DIRECTIVES],
    exports: [DialogComponent, ConfirmationDialogComponent, DATETIME_PICKER_DIRECTIVES, BOOTSTRAP_SELECT_DIRECTIVES]
})
export class BootstrapModule
{
}