/*
	Author Notes
*/


import {Component, Input}     from 'angular2/core';
import {DragZoneDirective} from './dragZone.directive';
import {DragDataService}          from './dragData.service';

@Component({
	selector    : 'drag',
	directives  : [DragZoneDirective],
	template: `   		
			<li *ngFor = "#el of dragZones; #idx = index" style = "float : left">
				<dragzone [dragZoneElems] = "el"></dragzone>
			</li>`,
	providers: [DragDataService],
})

export class DragDirective{
	dragZones: Object[][] = [];
	constructor(private _dragDataService : DragDataService) {
		this._dragDataService.getDragData().then(dragData => (this.dragZones.push(dragData)));
	}
}