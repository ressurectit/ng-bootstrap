import {NgModule} from '@angular/core';

import {TypeaheadControlValueAccessor} from '../directives/typeahead/typeaheadControlValueAccessor.directive';
import {TypeaheadDirective} from '../directives/typeahead/typeahead.directive';

/**
 * Module for bootstrap typeahead directives, components and pipes
 */
@NgModule(
{
    declarations: 
    [
        TypeaheadDirective,
        TypeaheadControlValueAccessor
    ],
    exports: 
    [
        TypeaheadDirective,
        TypeaheadControlValueAccessor
    ]
})
export class TypeaheadModule
{
}