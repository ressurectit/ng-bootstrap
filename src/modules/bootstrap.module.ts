import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DialogComponent} from '../components/dialog';
import {ConfirmationDialogComponent} from '../components/confirmationDialog';
import {DATETIME_PICKER_DIRECTIVES} from '../directives/datetimePicker';
import {BOOTSTRAP_SELECT_DIRECTIVES} from '../directives/bootstrapSelect';
import {TYPEAHEAD_DIRECTIVES} from '../directives/typeahead';
import {BootstrapPopoverDirective, BootstrapTooltipDirective} from '../directives/misc';
import {BootstrapSwitchDirective} from '../directives/bootstrapSwitch/bootstrapSwitch.directive';
import {TypeaheadTagsComponent, TypeaheadTagsControlValueAccessor} from '../components';

/**
 * Module for bootstrap components
 */
@NgModule(
{
    imports: [CommonModule],
    declarations: 
    [
        DialogComponent,
        ConfirmationDialogComponent,
        DATETIME_PICKER_DIRECTIVES,
        BOOTSTRAP_SELECT_DIRECTIVES,
        TYPEAHEAD_DIRECTIVES,
        BootstrapPopoverDirective,
        BootstrapTooltipDirective,
        BootstrapSwitchDirective,
        TypeaheadTagsComponent,
        TypeaheadTagsControlValueAccessor
    ],
    exports: 
    [
        DialogComponent,
        ConfirmationDialogComponent,
        DATETIME_PICKER_DIRECTIVES,
        BOOTSTRAP_SELECT_DIRECTIVES,
        TYPEAHEAD_DIRECTIVES,
        BootstrapPopoverDirective,
        BootstrapTooltipDirective,
        BootstrapSwitchDirective,
        TypeaheadTagsComponent,
        TypeaheadTagsControlValueAccessor
    ]
})
export class BootstrapModule
{
}