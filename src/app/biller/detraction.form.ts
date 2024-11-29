import { FormControl } from "@angular/forms"

export interface DetractionForm {
    serviceCode: FormControl<string>
    bankAccountNumber: FormControl<string>
    paymentCode: FormControl<string>
    percent: FormControl<number | null>
    amount: FormControl<number | null>
}