/*
	Author Notes
*/


import {Component, Input , OnInit}     from 'angular2/core';
import {DragZoneDirective} from './dragZone.directive';
import {DragDataService}          from './dragData.service';
import {MessageBus} from './messageBus/messageBus';
import {IMessageBus} from './messageBus/IMessageBus';

@Component({
	selector    : 'drag',
	directives  : [DragZoneDirective],
	template: `   	
			<div class = "row">
				<dragzone [dragZoneId] = "0"  [dragZoneElems] = "dragZones[0]" class="col-md-2"></dragzone>
				<dragzone [dragZoneId] = "1"  [dragZoneElems] = "dragZones[1]" class="col-md-2"></dragzone>
				<div class = "col-md-4"><h1>{{message}}</h1></div>
			</div>	
			`,
	providers: [DragDataService],
})

export class DragDirective implements OnInit{
	dragZones: Object[][] = [];
	private _messageBus: IMessageBus;
	private message: string;
	constructor(private _dragDataService : DragDataService) {
		this._dragDataService.getDragData().then(dragData => { this.dragZones.push(dragData); this.dragZones.push([]) });
		this._messageBus = MessageBus;
	}

	ngOnInit(){
		this._messageBus.listen("zoneDrop", (obj , zoneId) => {
			this.message = obj["first"] + " " + obj["last"] + " dropped in zone " + zoneId;
		});
	}
}