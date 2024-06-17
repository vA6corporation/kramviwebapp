import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { EventModel } from "../../events/event.model";
import { SettingModel } from "../../auth/setting.model";
import { OfficeModel } from "../../auth/office.model";

export function buildEvent80mm(
    event: EventModel,
    setting: SettingModel,
    office: OfficeModel,
): jsPDF {
    const header = 11
    const body = 8
    const marginLeft = setting.marginLeft

    const pdf = new jsPDF('p', 'mm', [297, 72])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 3
    const pageCenter = 35
    if (setting.logo) {
        positionY += 40
        pdf.addImage(setting.logo, "JPEG", 15 + marginLeft, 0, 40, 40)
    }

    text = (office.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 70, { align: 'center' })
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3 * strArr.length
    positionY += 2

    text = 'CITA MEDICA'
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4

    pdf.setFontSize(body)

    pdf.line(0 + marginLeft, positionY, 72, positionY) // horizontal line
    positionY += 5

    pdf.setFont('Helvetica', 'normal')
    text = 'Fecha de la cita:'
    pdf.text(text, 22, positionY, { align: 'right' })
    pdf.setFont('Helvetica', 'bold')
    text = `${formatDate(event.scheduledAt || '', 'dd/MM/yyyy', 'en-US')}`
    pdf.text(text, 24, positionY, { align: 'left' })
    positionY += 4

    pdf.setFont('Helvetica', 'normal')
    text = 'Hora de la cita:'
    pdf.text(text, 22, positionY, { align: 'right' })
    pdf.setFont('Helvetica', 'bold')
    text = `${formatDate(event.scheduledAt || '', 'h:mm a', 'en-US')}`
    pdf.text(text, 24, positionY, { align: 'left' })
    positionY += 4

    pdf.setFont('Helvetica', 'normal')
    text = 'Medico:'
    pdf.text(text, 22, positionY, { align: 'right' })
    // pdf.setFont('Helvetica', 'bold')
    text = event.worker.name
    pdf.text(text, 24, positionY, { align: 'left' })
    positionY += 4

    pdf.setFont('Helvetica', 'normal')
    text = 'Especialidad:'
    pdf.text(text, 22, positionY, { align: 'right' })
    // pdf.setFont('Helvetica', 'bold')
    text = event.specialty.name
    pdf.text(text, 24, positionY, { align: 'left' })
    positionY += 4

    pdf.line(0 + marginLeft, positionY, 72, positionY) // horizontal line
    positionY += 5

    pdf.setFont('Helvetica', 'normal')
    text = 'Paciente:'
    pdf.text(text, 22, positionY, { align: 'right' })
    pdf.setFont('Helvetica', 'bold')
    text = event.customer.name
    pdf.text(text, 24, positionY, { align: 'left' })
    positionY += 4

    pdf.setFont('Helvetica', 'normal')
    text = 'Detalles:'
    pdf.text(text, 22, positionY, { align: 'right' })

    for (const eventItem of event.eventItems) {
        // pdf.setFont('Helvetica', 'bold')
        text = eventItem.fullName.toUpperCase()
        pdf.text(text, 24, positionY, { align: 'left' })
        positionY += 4
    }

    pdf.setFont('Helvetica', 'normal')
    text = 'Registrador:'
    pdf.text(text, 22, positionY, { align: 'right' })
    pdf.setFont('Helvetica', 'bold')
    text = event.user.name
    pdf.text(text, 24, positionY, { align: 'left' })
    positionY += 4

    pdf.setFont('Helvetica', 'normal')
    text = 'F/H de registro:'
    pdf.text(text, 22, positionY, { align: 'right' })
    // pdf.setFont('Helvetica', 'bold')
    text = formatDate(event.createdAt, 'dd/MM/yyyy, h:mm a', 'en-US')
    pdf.text(text, 24, positionY, { align: 'left' })
    positionY += 8

    pdf.setFont('Helvetica', 'bold')
    text = '*** Asistir 15min. antes de la hora indicada ***'
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })

    return pdf
}