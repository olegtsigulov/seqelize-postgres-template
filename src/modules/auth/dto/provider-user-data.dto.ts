import * as Joiful from 'joiful';
import { ProvidersEnum } from '../enum/providers.enum';

export class ProviderUserData {
    @(Joiful.string().optional())
    displayName?: string;

    @(Joiful.string().optional())
    firstName: string;

    @(Joiful.string().optional())
    lastName?: string;

    @(Joiful.string().valid(Object.values(ProvidersEnum)).required())
    provider: string;

    @(Joiful.string().required())
    id: string;

    @(Joiful.string().email().required())
    email: string;

    @(Joiful.string().optional())
    avatar?: string;
}
