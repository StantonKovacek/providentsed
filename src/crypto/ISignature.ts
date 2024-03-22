import { IsOptional, IsString } from 'class-validator';

export interface ISignature {
    nonce: string;
    value: string;
    publicKey: string;
    algorithm?: string;
}

export class Signature implements ISignature {
    @IsString()
    nonce: string;

    @IsString()
    value: string;

    @IsString()
    publicKey: string;

    @IsOptional()
    @IsString()
    algorithm?: string;
}
