/*
	Drag Elements Restrict to DragZone. They Can be rearranged within
	DragZones.
	Drag Elements and can be moved from one drag zone to another, else they snap back
	to the current dragzone.
	DragZone manages dragElement callbacks registers and unregisters them
 */


import {Component , Input, EventEmitter , OnInit} from 'angular2/core';
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
	
	@Input() dragZoneElems: Object[];
	constructor() {
		this._messageBus = MessageBus;
	}

	ngOnInit(){
		// this._messageBus.listen("dragStop", (val) => {
		// 	let index = this.dragZoneElems.indexOf(val);
		// 	if(index > -1)
		// 		this.dragZoneElems.splice(index, 1);
		// });
	}
}