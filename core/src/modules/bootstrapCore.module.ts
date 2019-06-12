import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DialogComponent} from '../components/dialog';
import {ConfirmationDialogComponent} from '../components/confirmationDialog';
import {BootstrapPopoverDirective, BootstrapTooltipDirective} from '../directives/misc';

/**
 * Module for bootstrap core components, directives and pipes
 */
@NgModule(
{
    imports:
    [
        CommonModule
    ],
    declarations: 
    [
        DialogComponent,
        ConfirmationDialogComponent,
        BootstrapPopoverDirective,
        BootstrapTooltipDirective
    ],
    exports: 
    [
        DialogComponent,
        ConfirmationDialogComponent,
        BootstrapPopoverDirective,
        BootstrapTooltipDirective
    ]
})
export class BootstrapCoreModule
{
}