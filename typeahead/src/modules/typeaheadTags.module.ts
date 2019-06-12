import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TypeaheadModule} from './typeahead.module';
import {TypeaheadTagsControlValueAccessor} from '../directives/typeaheadTags/typeaheadTagsControlValueAccessor.directive';
import {TypeaheadTagsComponent} from '../components/typeaheadTags/typeaheadTags.component';

/**
 * Module for bootstrap typeahead tags directives, components and pipes
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        TypeaheadModule
    ],
    declarations: 
    [
        TypeaheadTagsControlValueAccessor,
        TypeaheadTagsComponent
    ],
    exports: 
    [
        TypeaheadTagsControlValueAccessor,
        TypeaheadTagsComponent
    ]
})
export class TypeaheadTagsModule
{
}