import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
    // editor
    .grant(AppRoles.EDITOR)
    .create(['departments', 'vols'])
    .update(['departments', 'vols'])
    // admin
    .grant(AppRoles.ADMIN)
    .extend(AppRoles.EDITOR)
    .create(['companies', 'vols'])
    .update(['companies', 'vols'])
    .delete(['companies', 'departments', 'vols']);
