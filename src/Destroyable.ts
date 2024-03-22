import { Observable, Subject } from 'rxjs';
import { IDestroyable } from './IDestroyable';
import * as _ from 'lodash';

export class Destroyable implements IDestroyable {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private _destroyed: Subject<void>;
    private _isDestroyed: boolean;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        this._destroyed = new Subject();
        this._isDestroyed = false;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }

        this._isDestroyed = true;

        this._destroyed.next();
        this._destroyed.complete();
        this._destroyed = null;
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get destroyed(): Observable<void> {
        return !_.isNil(this._destroyed) ? this._destroyed.asObservable() : null;
    }

    public get isDestroyed(): boolean {
        return this._isDestroyed;
    }
}
