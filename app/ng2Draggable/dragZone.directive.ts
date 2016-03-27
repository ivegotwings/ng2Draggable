/*
	Drag Elements Restrict to DragZone. They Can be rearranged within
	DragZones.
	Drag Elements and can be moved from one drag zone to another, else they snap back
	to the current dragzone.
	DragZone manages dragElement callbacks registers and unregisters them
 */


import {Component, Input, EventEmitter, OnInit, ElementRef, Renderer, ViewChildren} from 'angular2/core';
import {DragElementDirective}   from './dragElement.directive';
import {DragResponderDirective}   from './dragResponder.directive';
import {MessageBus} from './messageBus/messageBus';
import {IMessageBus} from './messageBus/IMessageBus';

@Component({
	selector: 'dragzone',
	directives: [DragElementDirective, DragResponderDirective],
	template :`
		<div style = "background : blue; height:600px">
		  <div class="panel panel-default">
		  	    <div class="panel-heading">
			      <h3 class="panel-title">Drag Zone</h3>
			    </div>
				<ul class="nav nav-pills nav-stacked" style="list-style: none">
			   		<li *ngFor = "#el of dragZoneElems; #idx = index">
						<h4 #dragElem [style.position]="'fixed'" [style.top.px]="idx* 30" [style.margin-top] = "80.0" [style.z-index] = 100 [dragResponder] = "el">{{el.first}} {{el.last}}</h4>
					</li>
				</ul>
		  </div>
		</div> 	
	`
})

export class DragZoneDirective implements OnInit{
	private _messageBus : IMessageBus
	private _elem: ElementRef;
	private _renderer: Renderer;
	private static HITTEST: boolean = false;
	private _hasElem: boolean = false;
	private _hitObjectIndex : number = -1;

	@Input() dragZoneElems: Object[];
	@Input() dragZoneId: number;
	@ViewChildren('dragElem') dragElems : any;
	constructor(private _el: ElementRef, private _rend: Renderer) {
		this._messageBus = MessageBus;
		this._elem = _el;
		this._renderer = _rend;
	}

	ngOnInit(){
		this._messageBus.registerDispatchEndCallBack( (event, obj) => 
		{
			if (event == "dragStop") {
				if (!DragZoneDirective.HITTEST) {
					this._messageBus.dispatch("noZone", obj);
				}
			}
		});

		this._messageBus.listen("noZone", (obj) => {
			if(this._hasElem){
				let clone: Object = JSON.parse(JSON.stringify(obj));
				this.dragZoneElems.push(clone);
			}
		});

		this._messageBus.listen("dragStart", (obj, event) => {
			DragZoneDirective.HITTEST = false;
			this._hasElem = false;
			this._hitObjectIndex = -1;
		});	
		this._messageBus.listen("dragStop", (obj, event) => {
			let index = this.dragZoneElems.indexOf(obj);
			let hitObjectIndex : number = -1;
			if (this.hitTest(event.x, event.y))
			{
				hitObjectIndex = this.elemHitTest(event.x, event.y, index);
				DragZoneDirective.HITTEST = true;
				let clone: Object = JSON.parse(JSON.stringify(obj));
				this.dragZoneElems.push(clone);
				this._messageBus.dispatch("zoneDrop", obj, this.dragZoneId);
			}
			if (index > -1) {
				console.log(hitObjectIndex);
				this.dragZoneElems.splice(index, 1);
				this._hasElem = true;
			}
			if (hitObjectIndex > -1) {
				//swap elements
				let dropElem = this.dragZoneElems[this.dragZoneElems.length - 1];
				let swapArray: Object[] = [];
				for (let i = this.dragZoneElems.length - 1; i >= hitObjectIndex; i--) {
					let popedElem = this.dragZoneElems.pop();
					swapArray.push(popedElem);
				}
				this.dragZoneElems.push(swapArray[0]);
				while (swapArray.length > 1) {
					let popedElem = swapArray.pop();
					this.dragZoneElems.push(popedElem);
				}
			}
		});
	}

	hitTest(x:number ,y: number){
		let bounds = this._elem.nativeElement.getBoundingClientRect();// ngDraggable.getPrivOffset(element);
		return  x >= bounds.left
			 && x <= bounds.right
			 && y <= bounds.bottom
			 && y >= bounds.top;
	}

	elemHitTest(x: number, y: number, index : number) : any{
		if (this.dragElems.length == 0)
			return -1;
		for (let i = 0; i < this.dragElems.length; i++)
		{
			if (i == index) continue;
			let bounds = this.dragElems._results[i].nativeElement.getBoundingClientRect();
			if (x >= bounds.left && x <= bounds.right && y <= bounds.bottom && y >= bounds.top) {
				//We have a colliding element
				return i;
			}
		}
		return -1;
	}
}