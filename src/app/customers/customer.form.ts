import { FormArray, FormControl } from "@angular/forms"
import { DocumentType } from "./document-type.enum"

export interface CustomerForm {
    document: FormControl<string>
    documentType: FormControl<DocumentType>
    name: FormControl<string>
    addresses: FormArray<FormControl<string>>
    mobileNumber: FormControl<string>
    email: FormControl<string>
    birthDate: FormControl<string>
    observations: FormControl<string>
}
