import {Component, Input} from 'angular2/core';
import {DragResponderDirective}   from './dragResponder.directive';

@Component({
	selector: 'dragelement',
	directives: [DragResponderDirective],
	template: `
		<h4 [style.position]="'fixed'" [style.top.px]="idx* 30" [style.margin-top] = "80.0" [style.z-index] = 100 [dragResponder] = "{{dragElem}}">{{dragElem.first}} {{dragElem.last}}</h4>
	`,
})

export class DragElementDirective{
	@Input() dragElem: Object;
	constructor(){

	}
}
