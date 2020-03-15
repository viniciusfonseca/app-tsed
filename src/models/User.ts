namespace App.Models {

    export enum UserRole {
        ADMIN = 'ADMIN',
        CUSTOMER = 'CUSTOMER'
    }

    export interface User {
        name: string
        email: string
        password: string
        role: UserRole
    }
}