import { FormArray, FormControl } from '@angular/forms'
import { DocumentType } from './document-type.enum'

export interface CustomerForm {
    document: FormControl<string>
    documentType: FormControl<DocumentType>
    name: FormControl<string>
    address: FormControl<string>
    phone: FormControl<string>
    email: FormControl<string>
    observation: FormControl<string>
    creditLimit: FormControl<number|null>
}
