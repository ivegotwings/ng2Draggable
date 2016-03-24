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
			<div class = "row">
				<dragzone  [dragZoneElems] = "dragZones[0]" class="col-xs-4"></dragzone>
				<dragzone  [dragZoneElems] = "dragZones[1]" class="col-xs-4"></dragzone>
			</div>	
			`,
	providers: [DragDataService],
})

export class DragDirective{
	dragZones: Object[][] = [];
	constructor(private _dragDataService : DragDataService) {
		this._dragDataService.getDragData().then(dragData => { this.dragZones.push(dragData); this.dragZones.push([]) });
	}
}