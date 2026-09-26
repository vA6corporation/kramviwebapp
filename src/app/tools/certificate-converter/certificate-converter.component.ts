import { Component, inject, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { NavigationService } from '../../navigation/navigation.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-certificate-converter',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './certificate-converter.component.html',
    styleUrl: './certificate-converter.component.sass',
})
export class CertificateConverterComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)

    $isLoading = signal<boolean>(false)
    $file = signal<File | null>(null)

    formGroup: FormGroup = this.formBuilder.group({
        password: '',
    })

    onFileCertificateSelected(files: FileList | null, input: HTMLInputElement) {
        if (files !== null && files[0] !== null) {
            const file: File = files[0]
            input.value = ''
            if (file) {
                this.$file.set(file)
            }
        }
    }

    async onSubmit() {
        const file = this.$file()
        const { password } = this.formGroup.value

        if (!password) {
            this.navigationService.showMessage('Ingresa la contraseña del certificado')
            return
        }

        if (file) {
            const formData = new FormData()
            formData.append('file', file, file.name)
            try {
                const response = await fetch(`http://35.229.108.183/${password}`, {
                    method: 'POST',
                body: formData,
                })

                if (!response.ok) {
                    this.navigationService.showMessage('Error al convertir certificado')
                    throw new Error(`Response status: ${response.status}`)
                }

                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const fileName = 'certificates.zip'

                const link = document.createElement("a")
                link.download = fileName
                link.href = url
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } catch(error) {
                this.navigationService.showMessage('Error al convertir certificado')
            }
        } else {
            this.navigationService.showMessage('Seleccione un certificado')
        }
    }

}
