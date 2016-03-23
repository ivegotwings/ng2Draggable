/*
	Drag Elements Restrict to DragZone. They Can be rearranged within
	DragZones.
	Drag Elements and can be moved from one drag zone to another, else they snap back
	to the current dragzone.
	DragZone manages dragElement callbacks registers and unregisters them
 */


import {Component , Input} from 'angular2/core';
import {DragResponderDirective}   from './dragResponder.directive';

@Component({
	selector: 'dragzone',
	templateUrl : './app/ng2Draggable/drag.html',
	directives: [DragResponderDirective],
})

export class DragZoneDirective{
	@Input() dragZoneElems: Object[];
	constructor() {
		console.log(this.dragZoneElems);
	}
}