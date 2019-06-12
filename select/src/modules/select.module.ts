import {NgModule} from '@angular/core';

import {BootstrapSelectDirective} from '../directives/bootstrapSelect/bootstrapSelect.directive';
import {BootstrapSelectControlValueAccessor} from '../directives/bootstrapSelect/bootstrapSelectControlValueAccessor.directive';
import {BootstrapSelectOptionDirective} from '../directives/bootstrapSelect/bootstrapSelectOption.directive';

/**
 * Module for bootstrap select directives, components and pipes
 */
@NgModule(
{
    declarations: 
    [
        BootstrapSelectDirective,
        BootstrapSelectControlValueAccessor,
        BootstrapSelectOptionDirective
    ],
    exports: 
    [
        BootstrapSelectDirective,
        BootstrapSelectControlValueAccessor,
        BootstrapSelectOptionDirective
    ]
})
export class SelectModule
{
}