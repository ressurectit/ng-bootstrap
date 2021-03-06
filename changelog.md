# Changelog

## Version 7.0.0

- updated to latest stable *Angular* 9
- added generating of API doc
- removed `BootstrapModule`

## Version 6.1.2

 - fixed dateTimePickerControlValueAccessor value change

## Version 6.1.1

 - fixed dependency on `moment`, now using original typings

## Version 6.1.0

 - complete refactoring of module, split into *subpackages* according its dependencies
 - now it is not required to use all external bootstrap libraries if used with *subpackages*
 - all *core* bootstrap dependent code moved into `@anglr/bootstrap/core`
    - that means `ConfirmationDialogComponent`, `DialogComponent`, `BootstrapPopoverDirective`, `BootstrapTooltipDirective`
    - created new module for all of these `BootstrapCoreModule`
- all *datetimepicker* bootstrap dependent code moved into `@anglr/bootstrap/datetimepicker`
    - that means `DatetimePickerDirective`, `DatetimePickerControlValueAccessor`
    - created new module for all of these `DatetimepickerModule`
- all *select* bootstrap dependent code moved into `@anglr/bootstrap/select`
    - that means `BootstrapSelectDirective`, `BootstrapSelectControlValueAccessor`, `BootstrapSelectOptionDirective`
    - created new module for all of these `SelectModule`
- all *switch* bootstrap dependent code moved into `@anglr/bootstrap/switch`
    - that means `BootstrapSwitchDirective`, `BootstrapSwitchControlValueAccessor`
    - created new module for all of these `SwitchModule`
- all *typeahead* bootstrap dependent code moved into `@anglr/bootstrap/typeahead`
    - that means `TypeaheadTagsComponent`, `TypeaheadDirective`, `TypeaheadControlValueAccessor`, `TypeaheadTagsControlValueAccessor`
    - created new modules for all of these `TypeaheadModule`, respectively `TypeaheadTagsModule`

## Version 6.0.0

 - Angular IVY ready (APF compliant package)
 - added support for ES2015 compilation
 - Angular 8
 - `ConfirmationDialogComponent` template can be specified only using `ContentChild`

## Version 5.0.2
 - bootstrap switch now supports direct binding using `value` and `valueChanged`

## Version 5.0.1
 - fixed setting date for `DateTimePickerDirective` if is lesser than *minDate* or greater than *maxDate*

## Version 4.0.11
 - fixed setting date for `DateTimePickerDirective` if is lesser than *minDate* or greater than *maxDate*

## Version 5.0.0
 - stabilized for angular v6

## Version 5.0.0-beta.2
 - `@anglr/bootstrap` is now marked as *sideEffects* free
 - fixed `DatetimePickerDirective`, now is using updated version of `GlobalizationService`

## Version 5.0.0-beta.1
 - aktualizácia balíčkov `Angular` na `6`
 - aktualizácia `Webpack` na verziu `4`
 - aktualizácia `rxjs` na verziu `6`
 - automatické generovanie dokumentácie

## Version 4.0.10
 - fixed changing value of `TypeaheadTagsComponent` from code, which missed call of *change detection*

## Version 4.0.9
 - fixed bootstrap switch, now working correctly

## Version 4.0.8
 - added method `refresh` to `BootstrapSelectDirective` which allows you to refresh visuals of bootstrap select from current HTML `<select>`

## Version 4.0.7
 - fixed `BootstrapSwitchDirective` which now supports SSR

## Version 4.0.6
 - `TypeaheadTagsComponent` now removes written text when duplicite value is found
 - `TypeaheadTagsComponent` removed outline highlight for chrome

## Version 4.0.5
 - `TypeaheadTagsComponent` correctly calls `ChangeDetectorRef` for change detection

## Version 4.0.4
 - added new component `TypeaheadTagsComponent`

## Version 4.0.3
 - adding css class to input if no value is selected and text is inserted in input
 - support for using free text as value of typeahead
 - support for specifying displayedProperty using `string` or `function`

## Version 4.0.2
 - returned typescript version back to 2.4.2 and removed distJit

## Version 4.0.1
 - added compiled outputs for Angular JIT

## Version 4.0.0
 - updated angular to 5.0.0 (final)
 - changed dependencies of project to peerDependencies
 - more strict compilation
 - updated usage of rxjs, now using operators

## Version 4.0.0-beta.0
 - updated angular to >=5.0.0-rc.7