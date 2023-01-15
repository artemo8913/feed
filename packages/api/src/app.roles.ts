import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
    // editor
    .grant(AppRoles.EDITOR)
    .read(['departments', 'vols'])
    .create(['departments', 'vols'])
    .update(['departments', 'vols'])
    // admin
    .grant(AppRoles.ADMIN)
    .extend(AppRoles.EDITOR)
    .read(['departments', 'companies', 'vols'])
    .create(['departments', 'companies', 'vols'])
    .update(['departments', 'companies', 'vols'])
    .delete(['departments', 'companies', 'vols']);
