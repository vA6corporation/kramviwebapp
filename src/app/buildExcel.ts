import * as XLSX from 'xlsx'

export function buildExcel(body: any[], name: string, wscols: any[] = [], wsrows: any[] = [], merges: any[] = []) {
    const wb = XLSX.utils.book_new()
    wb.Props = {
        Title: "SheetJS Tutorial",
        Subject: "Test",
        Author: "Red Stapler",
        CreatedDate: new Date()
    }
    wb.SheetNames.push("Reporte")
    const ws_data = body
    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    wb.Sheets["Reporte"] = ws

    wscols.forEach((item, index) => {
        wscols[index] = { wch: item }
    })
    ws['!cols'] = wscols

    wsrows = wsrows.map(e => ({ hpx: e }))
    ws['!rows'] = wsrows
    XLSX.writeFile(wb, `${name}.xlsx`)
}

export function parseExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.onload = (e) => {
            var data = e.target?.result
            var workbook = XLSX.read(data, {
                type: 'binary'
            })
            workbook.SheetNames.forEach((sheetName) => {
                var XL_row_object: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {})
                const arrayJson = []
                for (const obj of XL_row_object) {
                    const keys = Object.keys(obj)
                    const newObject: any = {}
                    keys.forEach(e => Object.assign(newObject, { [e.trim()]: obj[e] }))
                    arrayJson.push(newObject)
                }
                resolve(arrayJson)
            })
        }
        reader.onerror = function (ex) {
            reject()
        }
        reader.readAsArrayBuffer(file)
    })
}