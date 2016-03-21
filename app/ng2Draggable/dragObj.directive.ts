import {Directive, ElementRef, EventEmitter, Input, OnInit, Renderer, Attribute, HostListener} from 'angular2/core';
import Rx from 'rxjs/Rx';

@Directive({
	selector : '[dragObj]',
})

export class DragObjDirective implements OnInit{

	private _elem: ElementRef;
	private _elemBounds: ClientRect;
	private _mousedrag: Rx.Observable<any>;
	private _mouseup  : EventEmitter<any> = new EventEmitter(); 
	private _mousedown: EventEmitter<any> = new EventEmitter(); 
	private _mousemove: EventEmitter<any> = new EventEmitter(); 
	private _mouseout : EventEmitter<any> = new EventEmitter();
	private _margin: number[] = new Array<number>();
	private _startPos: Object;
	private _dragEnabled : boolean = false;
	private _dragObj: Object;
	private _dropZoneElem: boolean;

	@Input() dragResponder: boolean;
	constructor(private _el: ElementRef, private _renderer : Renderer) {
			this._elem = _el;
			this._mousedrag = this._mousedown.switchMap((mdwnEvn, i) => {
				this._dragEnabled = true;
				this.DisableSelection();
				mdwnEvn.preventDefault();

				return Rx.Observable.create((observer) => {
					observer._next({
						prevx: mdwnEvn.x - this._elemBounds.left - window.pageXOffset,
						prevy: mdwnEvn.y - this._elemBounds.top  - window.pageYOffset
					});
					observer._complete();
				});
			}).flatMap((offSet, i) => {
				return this._mousemove.switchMap((mmoveEvn, i) => {
					mmoveEvn.preventDefault();
					this.DisableSelection();
					return Rx.Observable.create(observer => {
						observer._next({
							left: mmoveEvn.x - offSet["prevx"],
							top : mmoveEvn.y - offSet["prevy"]
						});
						observer._complete();
					});
				}).takeUntil(this._mouseout).takeUntil(this._mouseup);
			});
		}

	ngOnInit(){
		this.InitBounds();
		this._elem.nativeElement.style.cursor = 'pointer';
		this._startPos = { left: this._elemBounds.left, top: this._elemBounds.top };
		let margin = getComputedStyle(this._el.nativeElement).getPropertyValue('margin').split(" ");
		if (margin.length == 1)
		{
			this._margin.push(+margin[0].slice(0, margin[0].indexOf("px")));
			this._margin.push(+margin[0].slice(0, margin[0].indexOf("px")));
		}else{
			this._margin.push(+margin[0].slice(0, margin[0].indexOf("px")));
			this._margin.push(+margin[1].slice(0, margin[1].indexOf("px")));
		}
		this._mousedrag.subscribe({
			next: pos => {
				this.SetPosition(pos);
			}
		});
	}

	SetPosition(pos : Object){
		this._renderer.setElementStyle(this._elem.nativeElement, "position", "fixed");
		this._renderer.setElementStyle(this._elem.nativeElement, "left", (pos["left"] - this._margin[1]).toString() + "px");
		this._renderer.setElementStyle(this._elem.nativeElement, "top" ,  (pos["top"] - this._margin[0]).toString() + "px");
	}

	InitBounds(){
		this._elemBounds     = this._elem.nativeElement.getBoundingClientRect();
	}

	@HostListener('mouseenter', ['$event'])
	OnMouseEnter(event){
		this.DisableSelection();
	}

	@HostListener('mouseout', ['$event'])
	OnMouseOut(event) {
		if (!this._dragEnabled) return;
		this._mouseout.next(event);
		if (this._dropZoneElem) {
			this.SetPosition({ top: this._startPos["top"], left: this._startPos["left"] });
			this.InitBounds();
		} else {
			this.InitBounds();
			this.SetPosition({ left: this._elemBounds.left, top: this._elemBounds.top });
		}
	}

	@HostListener('mouseup', ['$event'])
	OnMouseUp(event){
		this._mouseup.next(event);
		this._dragEnabled = false;
		if (this._dropZoneElem) {
			this.SetPosition({ top: this._startPos["top"], left: this._startPos["left"] });
			this.InitBounds();
		}else{
			this.InitBounds();
			this.SetPosition({ left: this._elemBounds.left, top: this._elemBounds.top });
		}	
	}

	@HostListener('mousedown', ['$event'])
	OnMouseDown(event){
		this._mousedown.next(event);
	}

	@HostListener('mousemove', ['$event'])
	OnMouseMove(event){
		this._mousemove.next(event);
	}

	DisableSelection(){
		let sel: Selection;
		if (window.getSelection) {
			// Mozilla
			sel = window.getSelection();
		} else if (document.getSelection()) {
			// IE
			sel = document.getSelection();
		}

		// Mozilla
		if (sel.rangeCount) {
			sel.removeAllRanges();
			return;
		}

		// IE
		if (sel.toString() > '') {
			document.getSelection().empty();
			return;
		}
	}
}