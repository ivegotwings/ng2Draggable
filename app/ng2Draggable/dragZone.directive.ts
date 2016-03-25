/*
	Drag Elements Restrict to DragZone. They Can be rearranged within
	DragZones.
	Drag Elements and can be moved from one drag zone to another, else they snap back
	to the current dragzone.
	DragZone manages dragElement callbacks registers and unregisters them
 */


import {Component, Input, EventEmitter, OnInit, ElementRef, Renderer} from 'angular2/core';
import {DragResponderDirective}   from './dragResponder.directive';
import {MessageBus} from './messageBus/messageBus';
import {IMessageBus} from './messageBus/IMessageBus';

@Component({
	selector: 'dragzone',
	templateUrl : './app/ng2Draggable/drag.html',
	directives: [DragResponderDirective],
})

export class DragZoneDirective implements OnInit{
	private _messageBus : IMessageBus
	private _elem: ElementRef;
	private _renderer: Renderer;
	private static HITTEST: boolean = false;
	private _hasElem: boolean = false;

	@Input() dragZoneElems: Object[];
	@Input() dragZoneId: number;
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
		});	
		this._messageBus.listen("dragStop", (obj, event) => {
			if (this.hitTest(event.x, event.y))
			{
				//clone object
				let clone: Object = JSON.parse(JSON.stringify(obj));
				this.dragZoneElems.push(clone);
				DragZoneDirective.HITTEST = true;
				this._messageBus.dispatch("zoneDrop", obj, this.dragZoneId);
			}

			let index = this.dragZoneElems.indexOf(obj);
			if (index > -1)
			{
				this.dragZoneElems.splice(index, 1);
				this._hasElem = true;
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
}