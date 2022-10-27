import { registerEnumType } from "@nestjs/graphql";


export enum ValidRoles {
    admin = 'admin',
    superUser = 'super-user',
    user = 'user',
}

registerEnumType(ValidRoles, {name: 'ValidRoles', description: 'Valid Roles'});