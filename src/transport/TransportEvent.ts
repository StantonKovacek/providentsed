import * as _ from 'lodash';
import { ITransportEvent } from './ITransport';
import { IsString, IsOptional } from 'class-validator';
import { ValidateUtil } from '../util';
import * as uuid from 'uuid';

export class TransportEvent<T> implements ITransportEvent<T> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @IsString()
    public name: string;

    @IsString()
    public uid: string;

    @IsOptional()
    public data: T;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(name: string, data?: T, uid?: string) {
        this.uid = !_.isNil(uid) ? uid : uuid();
        this.name = name;
        if (!_.isNil(data)) {
            this.data = this.validateData(data);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected validateData(value: T): T {
        ValidateUtil.validate(value);
        return value;
    }
}
