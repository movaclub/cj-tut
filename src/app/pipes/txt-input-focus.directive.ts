import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTxtInputFocus]'
})
export class TxtInputFocusDirective implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.focus();
  }
}
