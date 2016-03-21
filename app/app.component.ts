import {Component} from 'angular2/core';
import {DragDirective} from './ng2Draggable/drag.directive';

@Component({
    selector: 'my-app',
	directives: [DragDirective],
    template: `<drag></drag>`,
})

export class AppComponent { 
}