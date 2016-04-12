import {Observable} from 'rxjs/Observable';

/**
 * Datetime picker globalization service for handling globalization changes
 */
export abstract class DatetimePickerGlobalizationService
{
    /**
     * Gets current name of locale, that is used within picker
     */
    public abstract getLocale(): string;
    
    /**
     * Gets observable that emits data when locale changes and change should be applied to picker
     */
    public abstract getLocaleChange(): Observable<string>;
}