/*
	This attribute directive makes the associated element draggable.
	Usage:
	 [dragResponder] = boolean //false will disable dragging
	Example:
	 <h1 [dragResponder] = "true"></h1>
*/


import {Component , OnInit} from 'angular2/core';
import {DragResponderDirective} from './dragResponder.directive';
import {DragObjDirective} from './dragObj.directive';


@Component({
	selector : 'drag',
	templateUrl : "./app/ng2Draggable/drag.html",
	directives: [DragResponderDirective, DragObjDirective]
})

export class DragDirective implements OnInit{

}