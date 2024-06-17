import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserModel } from '../users/user.model';
import { PrinterModel } from './printer.model';

@Injectable({
    providedIn: 'root'
})
export class PrintersService {

    constructor() { }

    private db: IDBDatabase | null = null
    private printers: PrinterModel[] = []
    private printers$ = new BehaviorSubject<PrinterModel[]>([])

    handlePrinters() {
        return this.printers$.asObservable()
    }

    loadDb(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (indexedDB) {
                const request = indexedDB.open('kramvi', 2)
                request.onsuccess = () => {
                    this.db = request.result
                    console.log('OPEN', this.db)
                    this.loadPrinters()
                    resolve()
                }

                request.onupgradeneeded = (e) => {
                    this.db = request.result
                    console.log('CREATE', this.db)
                    if (e.oldVersion < 1) {
                        this.db.createObjectStore('rememberUsers', { keyPath: '_id' })
                    }

                    if (e.oldVersion < 2) {
                        this.db.createObjectStore('printers', { keyPath: '_id' })
                    }
                }

                request.onerror = (error) => {
                    console.log('Error', error)
                    reject()
                }
            } else {
                reject()
            }
        })
    }

    putPrinter(printer: PrinterModel) {
        printer.name = printer.name.toUpperCase()
        const transaction = this.db?.transaction(['printers'], 'readwrite')
        const objectStore = transaction?.objectStore('printers')
        objectStore?.put(printer)
        this.loadPrinters()
    }

    deletePrinter(printerId: string) {
        if (this.db) {
            const transaction = this.db.transaction(['printers'], 'readwrite')
            const objectStore = transaction.objectStore('printers')
            const request = objectStore.delete(printerId)
            request.onsuccess = () => {
                this.loadPrinters()
            }
        }
    }

    loadPrinters() {
        if (this.db !== null) {
            const transaction = this.db.transaction(['printers'], 'readonly')
            const objectStore = transaction.objectStore('printers')
            const request = objectStore.openCursor()
            const printers: PrinterModel[] = []
            request.onsuccess = (e: any) => {
                const cursor = e.target.result
                if (cursor) {
                    printers.push(cursor.value)
                    cursor.continue()
                } else {
                    this.printers = printers
                    this.printers$.next(this.printers)
                }
            }
        }
    }
}
