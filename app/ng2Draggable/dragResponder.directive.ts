/*
	This attribute directive makes the associated element draggable.
	Usage:
	 [dragResponder] = boolean //false will disable dragging
	Example:
	<div [dragZone] = "true">
	 	<h1 [dragResponder] = "true"></h1>
	</div>

	Elements associated with DragResponder only respond when 
	inside a dragZone
*/


import {Directive, ElementRef, EventEmitter, Output, Input, OnInit, Renderer, Attribute, HostListener} from 'angular2/core';
import Rx from 'rxjs/Rx';
import {MessageBus} from './messageBus/messageBus';
import {IMessageBus} from './messageBus/IMessageBus';

@Directive({
	selector : '[dragResponder]',
})

export class DragResponderDirective implements OnInit{

	private _elem: ElementRef;
	private _messageBus: IMessageBus;
	private _elemBounds: ClientRect;
	private _mousedrag: Rx.Observable<any>;
	private _mouseup  : EventEmitter<any> = new EventEmitter(); 
	private _mousedown: EventEmitter<any> = new EventEmitter(); 
	private _mousemove: EventEmitter<any> = new EventEmitter(); 
	private _mouseout : EventEmitter<any> = new EventEmitter();
	private _margin: number[] = new Array<number>();
	private _startPos: Object;
	private  _dragInProgress : boolean;

	@Input('dragResponder') dragObject: Object;
	constructor(private _el: ElementRef, private _renderer : Renderer) {
			this._elem = _el;
			this._messageBus = MessageBus;
		}

	ngOnInit(){
		this.InitBounds();
		this._renderer.setElementStyle(this._elem.nativeElement, "cursor", "pointer");
		let margin = getComputedStyle(this._el.nativeElement).getPropertyValue('margin').split(" ");
		if (margin.length == 1)
		{
			this._margin.push(+margin[0].slice(0, margin[0].indexOf("px")));
			this._margin.push(+margin[0].slice(0, margin[0].indexOf("px")));
		}else{
			this._margin.push(+margin[0].slice(0, margin[0].indexOf("px")));
			this._margin.push(+margin[1].slice(0, margin[1].indexOf("px")));
		}
		this._mousedown.switchMap((mdwnEvn, i) => {
			this.DisableSelection();
			this.InitBounds();
			mdwnEvn.preventDefault();
			return Rx.Observable.create((observer) => {
				observer._next({
					prevx: mdwnEvn.x - this._elemBounds.left,
					prevy: mdwnEvn.y - this._elemBounds.top
				});
			});
		}).flatMap((offSet, i) => {
			return this._mousemove.flatMap((mmoveEvn, i) => {
				mmoveEvn.preventDefault();
				this.DisableSelection();
				this._dragInProgress = true;
				return Rx.Observable.create(observer => {
					observer._next({
						left: mmoveEvn.x - offSet["prevx"],
						top: mmoveEvn.y - offSet["prevy"]
					});
				});
			}).takeUntil(this._mouseout).takeUntil(this._mouseup);
		}).subscribe({
			next: pos => {
				this.SetPosition(pos);
			}
		});
	}

	SetPosition(pos : Object){
		this._renderer.setElementStyle(this._elem.nativeElement, "left", (pos["left"] - this._margin[1] - document.body.scrollLeft).toString() + "px");
		this._renderer.setElementStyle(this._elem.nativeElement, "top" ,  (pos["top"] - this._margin[0] - document.body.scrollTop).toString() + "px");
		this._renderer.setElementStyle(this._elem.nativeElement, "position", "fixed");
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
		if (!!this.dragObject && this._dragInProgress){
			console.log("MouseOut");
			this._dragInProgress = false;
			this._messageBus.dispatch("dragStop", this.dragObject, event);
			this._mouseout.next(event);
		} 
	}

	@HostListener('mouseup', ['$event'])
	OnMouseUp(event){
		if (!!this.dragObject && this._dragInProgress){
			this._mouseup.next(event);
			this._dragInProgress = false;
			this._messageBus.dispatch("dragStop", this.dragObject, event);
		}
	}

	@HostListener('mousedown', ['$event'])
	OnMouseDown(event){
		if (!!this.dragObject){
			this._mousedown.next(event);
		}
	}

	@HostListener('mousemove', ['$event'])
	OnMouseMove(event){
		if (!!this.dragObject){
			this._mousemove.next(event);
		}
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