import {NgModule} from '@angular/core';

import {DatetimePickerControlValueAccessor} from '../directives/datetimePicker/datetimePickerControlValueAccessor.directive';
import {DatetimePickerDirective} from '../directives/datetimePicker/datetimePicker.directive';

/**
 * Module for bootstrap datetimepicker directives, components and pipes
 */
@NgModule(
{
    declarations: 
    [
        DatetimePickerControlValueAccessor,
        DatetimePickerDirective
    ],
    exports: 
    [
        DatetimePickerControlValueAccessor,
        DatetimePickerDirective
    ]
})
export class DatetimepickerModule
{
}