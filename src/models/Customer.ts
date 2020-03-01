namespace App.Models {

    export interface Customer {
        name: string
        email: string
        password: string
        address: Address
    }

    export interface Address {
        street: string
        number: string
        city: string
        state: string
        postalCode: string
    }
}