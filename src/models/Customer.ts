namespace App.Models {

    export interface Customer extends User {
        address: Address
    }
    
    export interface Address {
        street: string
        number: string
        city: string
        state: string
        postal_code: string
    }
}