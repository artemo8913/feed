import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
    // editor
    .grant(AppRoles.EDITOR)
    .create(['jobs', 'vols'])
    .update(['jobs', 'vols'])
    // admin
    .grant(AppRoles.ADMIN)
    .extend(AppRoles.EDITOR)
    .create(['companies', 'vols'])
    .update(['companies', 'vols'])
    .delete(['companies', 'jobs', 'vols']);
