import { Observable, Subject } from 'rxjs';
import { DestroyableContainer } from './DestroyableContainer';
import { ObservableData } from './observer';
import { filter, map } from 'rxjs/operators';
import { ExtendedError } from './error';
import * as _ from 'lodash';

export abstract class Loadable<U = any, V = any> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected _status: LoadableStatus;
    protected observer: Subject<ObservableData<U | LoadableEvent, V | ILoadableStatusChangeData>>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    protected constructor() {
        super();
        this._status = LoadableStatus.NOT_LOADED;
        this.observer = new Subject();
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitStatusChangedProperties(oldStatus: LoadableStatus, newStatus: LoadableStatus): void {
        if (!_.isNil(this.observer)) {
            this.observer.next(new ObservableData(LoadableEvent.STATUS_CHANGED, { oldStatus, newStatus }));
        }
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
        super.destroy();

        this.observer.complete();
        this.observer = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Private Properties
    //
    // --------------------------------------------------------------------------

    protected get status(): LoadableStatus {
        return this._status;
    }

    protected set status(value: LoadableStatus) {
        if (value === this._status) {
            return;
        }
        let oldValue = this._status;
        this._status = value;
        this.commitStatusChangedProperties(oldValue, value);
    }
    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get events(): Observable<ObservableData<U | LoadableEvent, V | ILoadableStatusChangeData>> {
        return this.observer.asObservable();
    }

    public get started(): Observable<V> {
        return this.events.pipe(
            filter(item => item.type === LoadableEvent.STARTED),
            map(item => item.data as V)
        );
    }

    public get completed(): Observable<V> {
        return this.events.pipe(
            filter(item => item.type === LoadableEvent.COMPLETE),
            map(item => item.data as V)
        );
    }

    public get errored(): Observable<ExtendedError> {
        return this.events.pipe(
            filter(item => item.type === LoadableEvent.ERROR),
            map(item => item.error)
        );
    }

    public get finished(): Observable<V> {
        return this.events.pipe(
            filter(item => item.type === LoadableEvent.FINISHED),
            map(item => item.data as V)
        );
    }

    public get statusChanged(): Observable<ILoadableStatusChangeData> {
        return this.events.pipe(
            filter(item => item.type === LoadableEvent.STATUS_CHANGED),
            map(item => item.data as any)
        );
    }

    public get isLoaded(): boolean {
        return this.status === LoadableStatus.LOADED;
    }
    public get isError(): boolean {
        return this.status === LoadableStatus.ERROR;
    }
    public get isLoading(): boolean {
        return this.status === LoadableStatus.LOADING;
    }
    public get isNotLoaded(): boolean {
        return this.status === LoadableStatus.NOT_LOADED;
    }
}

export interface ILoadable {}

export interface ILoadableStatusChangeData {
    oldStatus: LoadableStatus;
    newStatus: LoadableStatus;
}

export enum LoadableEvent {
    ERROR = 'ERROR',
    STARTED = 'STARTED',
    COMPLETE = 'COMPLETE',
    FINISHED = 'FINISHED',

    STATUS_CHANGED = 'STATUS_CHANGED'
}

export enum LoadableStatus {
    ERROR = 'ERROR',
    LOADED = 'LOADED',
    LOADING = 'LOADING',
    NOT_LOADED = 'NOT_LOADED'
}
