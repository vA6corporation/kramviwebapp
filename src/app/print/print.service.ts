import { EventEmitter, Injectable } from '@angular/core';
import { BoardModel } from '../boards/board.model';
import { CreditNoteModel } from '../credit-notes/credit-note.model';
import { CustomerModel } from '../customers/customer.model';
import { EventModel } from '../events/event.model';
import { ExpenseModel } from '../expenses/expense.model';
import { PaymentOrderModel } from '../payment-orders/payment-order.model';
import { SummaryPaymentModel } from '../payments/summary-payment.model';
import { ProductModel } from '../products/product.model';
import { ProformaModel } from '../proformas/proforma.model';
import { PurchaseOrderModel } from '../purchase-orders/purchase-order.model';
import { PurchaseModel } from '../purchases/purchase.model';
import { RemissionGuideModel } from '../remission-guides/remission-guide.model';
import { SaleModel } from '../sales/sale.model';
import { SummarySaleItemModel } from '../sales/summary-sale-item.model';
import { TurnModel } from '../turns/turn.model';

export interface PrintTurnData {
    turn: TurnModel,
    expenses: ExpenseModel[],
    summaryPayments: SummaryPaymentModel[],
    summarySaleItems: SummarySaleItemModel[],
}

@Injectable({
    providedIn: 'root'
})
export class PrintService {

    constructor() { }

    private printBarcodes110x30mm$: EventEmitter<ProductModel[]> = new EventEmitter()
    private printBarcodes105x25mm$: EventEmitter<ProductModel[]> = new EventEmitter()
    private printBarcodes105x25mmTwo$: EventEmitter<ProductModel[]> = new EventEmitter()
    private printBarcodes70x30mm$: EventEmitter<ProductModel[]> = new EventEmitter()
    private printBarcodes70x30mmTwo$: EventEmitter<ProductModel[]> = new EventEmitter()
    private printBarcodes60x30mm$: EventEmitter<ProductModel[]> = new EventEmitter()
    private printBarcodes50x25mm$: EventEmitter<ProductModel[]> = new EventEmitter()
    private printBarcodes50x25mmTwo$: EventEmitter<ProductModel[]> = new EventEmitter()

    // private printTurn80mm$: EventEmitter<PrintTurnData> = new EventEmitter()
    private exportPdfEvent80mm$: EventEmitter<EventModel> = new EventEmitter()

    private printTurn80mm$: EventEmitter<PrintTurnData> = new EventEmitter()
    private printTurn58mm$: EventEmitter<PrintTurnData> = new EventEmitter()

    private printTicket80mm$: EventEmitter<SaleModel> = new EventEmitter()
    private exportPdfTicket80mm$: EventEmitter<SaleModel> = new EventEmitter()

    private printRemissionGuideTicket80mm$: EventEmitter<RemissionGuideModel> = new EventEmitter()
    private exportRemissionGuidePdfTicket80mm$: EventEmitter<RemissionGuideModel> = new EventEmitter()

    private printTicket58mm$: EventEmitter<SaleModel> = new EventEmitter()
    private exportPdfTicket58mm$: EventEmitter<SaleModel> = new EventEmitter()

    private printCommandFastFood80mm$: EventEmitter<SaleModel> = new EventEmitter()

    private printCommand80mm$: EventEmitter<BoardModel> = new EventEmitter()
    private printPreaccount80mm$: EventEmitter<BoardModel> = new EventEmitter()

    private printDeletedCommand80mm$: EventEmitter<BoardModel> = new EventEmitter()

    private printCommand58mm$: EventEmitter<BoardModel> = new EventEmitter()
    private printPreaccount58mm$: EventEmitter<BoardModel> = new EventEmitter()

    private printA4Invoice$: EventEmitter<SaleModel> = new EventEmitter()
    private exportPdfA4Invoice$: EventEmitter<SaleModel> = new EventEmitter()

    private printA4RemissionGuide$: EventEmitter<RemissionGuideModel> = new EventEmitter()
    private exportPdfA4RemissionGuide$: EventEmitter<RemissionGuideModel> = new EventEmitter()

    private printA4PurchaseOrder$: EventEmitter<PurchaseOrderModel> = new EventEmitter()
    private exportPdfA4PurchaseOrder$: EventEmitter<PurchaseOrderModel> = new EventEmitter()

    private printTicket80mmPurchaseOrder$: EventEmitter<PurchaseOrderModel> = new EventEmitter()
    private exportPdf80mmPurchaseOrder$: EventEmitter<PurchaseOrderModel> = new EventEmitter()

    private printA5Invoice$: EventEmitter<SaleModel> = new EventEmitter()
    private exportPdfA5Invoice$: EventEmitter<SaleModel> = new EventEmitter()

    private printA4Proforma$: EventEmitter<ProformaModel> = new EventEmitter()
    private exportPdfA4Proforma$: EventEmitter<ProformaModel> = new EventEmitter()

    private printTicketProforma$: EventEmitter<ProformaModel> = new EventEmitter()
    private exportPdfTicketProforma$: EventEmitter<ProformaModel> = new EventEmitter()

    private printA4ProformaImage$: EventEmitter<ProformaModel> = new EventEmitter()
    private exportPdfA4ProformaImage$: EventEmitter<ProformaModel> = new EventEmitter()

    private printA4CreditNote$: EventEmitter<CreditNoteModel> = new EventEmitter()
    private exportPdfA4CreditNote$: EventEmitter<CreditNoteModel> = new EventEmitter()

    private printTicketCreditNote$: EventEmitter<CreditNoteModel> = new EventEmitter()
    private exportPdfTicketCreditNote$: EventEmitter<CreditNoteModel> = new EventEmitter()

    private printPurchaseA4$: EventEmitter<PurchaseModel> = new EventEmitter()
    private exportPurchaseA4$: EventEmitter<PurchaseModel> = new EventEmitter()

    private printPaymentOrderA4$: EventEmitter<PaymentOrderModel> = new EventEmitter()
    private exportPaymentOrderA4$: EventEmitter<PaymentOrderModel> = new EventEmitter()

    private printCreditCustomer80mm$: EventEmitter<any> = new EventEmitter()
    private exportCreditCustomer80mm$: EventEmitter<any> = new EventEmitter()

    exportRemissionGuidePdfTicket80mm(remissionGuide: RemissionGuideModel): void {
        this.exportRemissionGuidePdfTicket80mm$.emit(remissionGuide)
    }

    handleExportRemissionGuidePdfTicket80mm() {
        return this.exportRemissionGuidePdfTicket80mm$.asObservable()
    }

    printRemissionGuideTicket80mm(remissionGuide: RemissionGuideModel): void {
        this.printRemissionGuideTicket80mm$.emit(remissionGuide)
    }

    handlePrintRemissionGuideTicket80mm() {
        return this.printRemissionGuideTicket80mm$.asObservable()
    }

    exportPdfEvent80mm(event: EventModel): void {
        this.exportPdfEvent80mm$.emit(event)
    }

    handleExportPdfEvent80mm() {
        return this.exportPdfEvent80mm$.asObservable()
    }

    // CreditCustomer 80mm ######
    printCreditCustomer80mm(customer: CustomerModel, credits: any[]) {
        this.printCreditCustomer80mm$.emit({ customer, credits })
    }

    handlePrintCreditCustomer80mm() {
        return this.printCreditCustomer80mm$.asObservable()
    }

    handlePrintBarcodes110x30mm() {
        return this.printBarcodes110x30mm$.asObservable()
    }

    handlePrintBarcodes105x25mm() {
        return this.printBarcodes105x25mm$.asObservable()
    }

    handlePrintBarcodes105x25mmTwo() {
        return this.printBarcodes105x25mmTwo$.asObservable()
    }

    handlePrintBarcodes70x30mm() {
        return this.printBarcodes70x30mm$.asObservable()
    }

    handlePrintBarcodes70x30mmTwo() {
        return this.printBarcodes70x30mmTwo$.asObservable()
    }

    handlePrintBarcodes60x30mm() {
        return this.printBarcodes60x30mm$.asObservable()
    }

    handlePrintBarcodes50x25mm() {
        return this.printBarcodes50x25mm$.asObservable()
    }

    handlePrintBarcodes50x25mmTwo() {
        return this.printBarcodes50x25mmTwo$.asObservable()
    }

    printBarcodes110x30mm(products: ProductModel[]) {
        this.printBarcodes110x30mm$.emit(products)
    }

    printBarcodes105x25mm(products: ProductModel[]) {
        this.printBarcodes105x25mm$.emit(products)
    }

    printBarcodes105x25mmTwo(products: ProductModel[]) {
        this.printBarcodes105x25mmTwo$.emit(products)
    }

    printBarcodes70x30mm(products: ProductModel[]) {
        this.printBarcodes70x30mm$.emit(products)
    }

    printBarcodes70x30mmTwo(products: ProductModel[]) {
        this.printBarcodes70x30mmTwo$.emit(products)
    }

    printBarcodes60x30mm(products: ProductModel[]) {
        this.printBarcodes60x30mm$.emit(products)
    }

    printBarcodes50x25mm(products: ProductModel[]) {
        this.printBarcodes50x25mm$.emit(products)
    }

    printBarcodes50x25mmTwo(products: ProductModel[]) {
        this.printBarcodes50x25mmTwo$.emit(products)
    }

    exportPdfCreditCustomer80mm(customer: CustomerModel, credits: any[]) {
        this.exportCreditCustomer80mm$.emit({ customer, credits })
    }

    handleExportPdfCreditCustomer80mm() {
        return this.exportCreditCustomer80mm$.asObservable()
    }

    // Turn 80mm #######
    printTurn80mm(printTurnData: PrintTurnData): void {
        this.printTurn80mm$.emit(printTurnData)
    }

    handlePrintTurn80mm() {
        return this.printTurn80mm$.asObservable()
    }

    // Turn 58mm ######
    printTurn58mm(printTurnData: PrintTurnData): void {
        this.printTurn58mm$.emit(printTurnData)
    }

    handlePrintTurn58mm() {
        return this.printTurn58mm$.asObservable()
    }

    // Ticket 80mm #######
    printTicket80mm(sale: SaleModel): void {
        this.printTicket80mm$.emit(sale)
    }

    handlePrintTicket80mm() {
        return this.printTicket80mm$.asObservable()
    }

    exportPdfTicket80mm(sale: SaleModel): void {
        this.exportPdfTicket80mm$.emit(sale)
    }

    handleExportPdfTicket80mm() {
        return this.exportPdfTicket80mm$.asObservable()
    }

    // Ticket 58mm ######
    printTicket58mm(sale: SaleModel): void {
        this.printTicket58mm$.emit(sale)
    }

    handlePrintTicket58mm() {
        return this.printTicket58mm$.asObservable()
    }

    exportPdfTicket58mm(sale: SaleModel): void {
        this.exportPdfTicket58mm$.emit(sale)
    }

    handleExportPdfTicket58mm() {
        return this.exportPdfTicket58mm$.asObservable()
    }

    // A4Invoice ######
    printA4Invoice(sale: SaleModel): void {
        this.printA4Invoice$.emit(sale)
    }

    handlePrintA4Invoice() {
        return this.printA4Invoice$.asObservable()
    }

    exportPdfA4Invoice(sale: SaleModel) {
        this.exportPdfA4Invoice$.emit(sale)
    }

    handleExportPdfA4Invoice() {
        return this.exportPdfA4Invoice$.asObservable()
    }

    // A4RemissionGuide ######
    printA4RemissionGuide(remissionGuide: RemissionGuideModel): void {
        this.printA4RemissionGuide$.emit(remissionGuide)
    }

    handlePrintA4RemissionGuide() {
        return this.printA4RemissionGuide$.asObservable()
    }

    exportPdfA4RemissionGuide(remissionGuide: RemissionGuideModel) {
        this.exportPdfA4RemissionGuide$.emit(remissionGuide)
    }

    handleExportPdfA4RemissionGuide() {
        return this.exportPdfA4RemissionGuide$.asObservable()
    }

    // A4PurchaseOrder ######
    printA4PurchaseOrder(purchaseOrder: PurchaseOrderModel): void {
        this.printA4PurchaseOrder$.emit(purchaseOrder)
    }

    handlePrintA4PurchaseOrder() {
        return this.printA4PurchaseOrder$.asObservable()
    }

    exportPdfA4PurchaseOrder(purchaseOrder: PurchaseOrderModel) {
        this.exportPdfA4PurchaseOrder$.emit(purchaseOrder)
    }

    handleExportPdfA4PurchaseOrder() {
        return this.exportPdfA4PurchaseOrder$.asObservable()
    }

    // Ticket80mmPurchaseOrder ######
    printTicket80mmPurchaseOrder(purchaseOrder: PurchaseOrderModel): void {
        this.printTicket80mmPurchaseOrder$.emit(purchaseOrder)
    }

    handlePrintTicket80mmPurchaseOrder() {
        return this.printTicket80mmPurchaseOrder$.asObservable()
    }

    exportPdfTicket80mmPurchaseOrder(purchaseOrder: PurchaseOrderModel) {
        this.exportPdf80mmPurchaseOrder$.emit(purchaseOrder)
    }

    handleExportPdf80mmPurchaseOrder() {
        return this.exportPdf80mmPurchaseOrder$.asObservable()
    }

    // A5Invoice ######
    printA5Invoice(sale: SaleModel): void {
        this.printA5Invoice$.emit(sale)
    }

    handlePrintA5Invoice() {
        return this.printA5Invoice$.asObservable()
    }

    exportPdfA5Invoice(sale: SaleModel) {
        this.exportPdfA5Invoice$.emit(sale)
    }

    handleExportPdfA5Invoice() {
        return this.exportPdfA5Invoice$.asObservable()
    }

    // Proforma A4 ######

    printA4Proforma(proforma: ProformaModel): void {
        this.printA4Proforma$.emit(proforma)
    }

    handlePrintA4Proforma() {
        return this.printA4Proforma$.asObservable()
    }

    exportPdfA4Proforma(proforma: ProformaModel) {
        return this.exportPdfA4Proforma$.emit(proforma)
    }

    handleExportPdfA4Proforma() {
        return this.exportPdfA4Proforma$.asObservable()
    }

    // Proforma Ticket ######

    printTicketProforma(proforma: ProformaModel): void {
        this.printTicketProforma$.emit(proforma)
    }

    handlePrintTicketProforma() {
        return this.printTicketProforma$.asObservable()
    }

    exportPdfTicketProforma(proforma: ProformaModel) {
        return this.exportPdfTicketProforma$.emit(proforma)
    }

    handleExportPdfTicketProforma() {
        return this.exportPdfTicketProforma$.asObservable()
    }

    // Proforma A4 Image

    printA4ProformaImage(proforma: ProformaModel): void {
        this.printA4ProformaImage$.emit(proforma)
    }

    handlePrintA4ProformaImage() {
        return this.printA4ProformaImage$.asObservable()
    }

    exportPdfA4ProformaImage(proforma: ProformaModel) {
        return this.exportPdfA4ProformaImage$.emit(proforma)
    }

    handleExportPdfA4ProformaImage() {
        return this.exportPdfA4ProformaImage$.asObservable()
    }

    // CreditNote ######
    printA4CreditNote(creditNote: CreditNoteModel) {
        return this.printA4CreditNote$.emit(creditNote)
    }

    handlePrintA4CreditNote() {
        return this.printA4CreditNote$.asObservable()
    }

    exportPdfA4CreditNote(creditNote: CreditNoteModel) {
        this.exportPdfA4CreditNote$.emit(creditNote)
    }

    handleExportPdfA4CreditNote() {
        return this.exportPdfA4CreditNote$.asObservable()
    }

    // CreditNote Ticket

    printTicketCreditNote(creditNote: CreditNoteModel) {
        return this.printTicketCreditNote$.emit(creditNote)
    }

    handlePrintTicketCreditNote() {
        return this.printTicketCreditNote$.asObservable()
    }

    exportPdfTicketCreditNote(creditNote: CreditNoteModel) {
        this.exportPdfTicketCreditNote$.emit(creditNote)
    }

    handleExportPdfTicketCreditNote() {
        return this.exportPdfTicketCreditNote$.asObservable()
    }

    // Command
    printCommand80mm(board: BoardModel): void {
        this.printCommand80mm$.emit(board)
    }

    handlePrintCommand80mm() {
        return this.printCommand80mm$.asObservable()
    }

    printDeletedCommand80mm(board: BoardModel): void {
        this.printDeletedCommand80mm$.emit(board)
    }

    handlePrintDeletedCommand80mm() {
        return this.printDeletedCommand80mm$.asObservable()
    }

    printCommandFastFood80mm(sale: SaleModel): void {
        this.printCommandFastFood80mm$.emit(sale)
    }

    handlePrintCommandFastFood80mm() {
        return this.printCommandFastFood80mm$.asObservable()
    }

    printCommand58mm(board: BoardModel): void {
        this.printCommand58mm$.emit(board)
    }

    handlePrintCommand58mm() {
        return this.printCommand58mm$.asObservable()
    }

    // Preaccound
    printPreaccount80mm(board: BoardModel): void {
        this.printPreaccount80mm$.emit(board)
    }

    handlePrintPreaccount80mm() {
        return this.printPreaccount80mm$.asObservable()
    }

    printPreaccount58mm(board: BoardModel): void {
        this.printPreaccount58mm$.emit(board)
    }

    handlePrintPreaccount58mm() {
        return this.printPreaccount58mm$.asObservable()
    }

    printPurchaseA4(purchase: PurchaseModel): void {
        this.printPurchaseA4$.emit(purchase)
    }

    handlePrintPurchaseA4() {
        return this.printPurchaseA4$.asObservable()
    }

    exportPurchaseA4(purchase: PurchaseModel) {
        this.exportPurchaseA4$.emit(purchase)
    }

    handleExportPdfPurchaseA4() {
        return this.exportPurchaseA4$.asObservable()
    }

    printPaymentOrderA4(paymentOrder: PaymentOrderModel) {
        this.printPaymentOrderA4$.emit(paymentOrder)
    }

    handlePrintPaymentOrderA4() {
        return this.printPaymentOrderA4$.asObservable()
    }

    exportPaymentOrderA4(paymentOrder: PaymentOrderModel) {
        this.exportPaymentOrderA4$.emit(paymentOrder)
    }

    handleExportPaymentOrderA4() {
        return this.exportPaymentOrderA4$.asObservable()
    }

}