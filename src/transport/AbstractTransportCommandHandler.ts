import { ExtendedError } from '../error';
import { ILogger, LoggerWrapper } from '../logger';
import { TransportWaitError } from './error/TransportWaitError';
import { ITransport, ITransportCommand } from './ITransport';
import * as _ from 'lodash';

export abstract class AbstractTransportCommandHandler<U, T extends ITransportCommand<U>> extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    protected constructor(logger: ILogger, protected transport: ITransport) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkRequest(params: U): U {
        return params;
    }

    protected handleError(command: T, error: Error): void {
        if (error instanceof TransportWaitError) {
            this.transport.wait(command);
            return;
        }
        if (_.isNil(error)) {
            error = new ExtendedError(`Undefined error`);
        }
        this.transport.complete(command, error);
        this.error(error, ExtendedError.instanceOf(error) && !error.isFatal ? '' : error.stack);
    }
}
