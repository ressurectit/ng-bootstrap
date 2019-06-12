import {NgModule} from '@angular/core';
import {DatetimepickerModule} from '@anglr/bootstrap/datetimepicker';
import {SelectModule} from '@anglr/bootstrap/select';
import {SwitchModule} from '@anglr/bootstrap/switch';
import {TypeaheadModule, TypeaheadTagsModule} from '@anglr/bootstrap/typeahead';
import {BootstrapCoreModule} from '@anglr/bootstrap/core';

/**
 * Module for bootstrap components
 */
@NgModule(
{
    exports: 
    [
        BootstrapCoreModule,
        DatetimepickerModule,
        SelectModule,
        SwitchModule,
        TypeaheadModule,
        TypeaheadTagsModule
    ]
})
export class BootstrapModule
{
}