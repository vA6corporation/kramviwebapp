import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[autofocus]',
    standalone: false
})
export class AutofocusDirective {

    constructor(
        private readonly el: ElementRef
    ) { }

    ngOnInit() {
        this.el.nativeElement.focus()
    }

}
