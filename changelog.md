# Changelog

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