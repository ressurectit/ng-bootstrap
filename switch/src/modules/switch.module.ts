import {NgModule} from '@angular/core';

import {BootstrapSwitchDirective} from '../directives/bootstrapSwitch/bootstrapSwitch.directive';
import {BootstrapSwitchControlValueAccessor} from '../directives/bootstrapSwitch/bootstrapSwitchControlValueAccessor.directive';

/**
 * Module for bootstrap switch directives, components and pipes
 */
@NgModule(
{
    declarations: 
    [
        BootstrapSwitchDirective,
        BootstrapSwitchControlValueAccessor
    ],
    exports: 
    [
        BootstrapSwitchDirective,
        BootstrapSwitchControlValueAccessor
    ]
})
export class SwitchModule
{
}