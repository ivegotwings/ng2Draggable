# ng2Draggable -  A modular Drag-Drop framework for Angular2.

This modules
  - Allow Elements to be dragged
  - Allow Elements to be dragged and dropped into dragzones
  - Allow Rearrangement of elements in dragZones

### Installation
 - clone this repository
 - cd into the installation directory
 - npm install
 - once components are installed do- npm start

### Module Usage

## DragResponder Attribute Directive
Attach this attribute directive to elements that need to be dragged. This directive takes the initialized object as input.

>     <li *ngFor = "#el of dragZoneElems; #idx = index">
>       <h4 #dragElem [style.position]="'fixed'" [style.top.px]="idx* 30" >         
>          [style.margin-top] = "80.0" [style.z-index] = 100 [dragResponder] 
>          = "el">{{el.first}} {{el.last}}
>       </h4>
>     </li>

The objects need to be positioned using "position = fixed". The z-index needs to be higher than other elements for visibillity.

> This directive is responsible for listening to mouseevents and position transformations.


### DragZone Directive.
DragZones manage dragElements. All mouseevents register callbacks with dragZone directive. Elements can only be arranged and dragged between dragZones. DragZones also handle re-ordering elements.

Draggable Elements have to be registered with dragZones.

	<div class = "row">
		<dragzone [dragZoneId] = "0"  [dragZoneElems] = "dragZones[0]"                
		   class="col-md-2"></dragzone>
	    <dragzone [dragZoneId] = "1"  [dragZoneElems] = "dragZones[1]"             
	       class="col-md-2"></dragzone>
	    <div class = "col-md-4"><h1>{{message}}</h1></div>
	</div>  	

DragZoneDirective take two input. dragZoneId : number and dragZoneElems: Object[]. Elements are registered in a dragZone using the dragZoneElems input value.

CallBacks-
DragZones provide a call back which is triggered when an element is dropped in a dragZone. When an object is dropped into a dragZone, "zoneDrop" event is fired.

		this._messageBus.listen("zoneDrop", (obj , zoneId) => {
			this.message = obj["first"] + " " + obj["last"] + " dropped in zone " + 
			   zoneId;
		});
The event receives the objectect dropped and the zoneId. These can be used to perform operations on the object. For example send an email to a customer when dropped into "elite-customer-zone". This event is listened in the drag directive.

### Drag Directive
DragDirective is the parent directive that organizes the entire functionality. DragZones are associated with dragDirective. Current implementation distributes data from dragDataService to dragZones and listens to zoneDrop Event.

### DragDataService
A DataSerivce which feeds data into the dragDirective.

### MessageBus
MessageBus class is used to manage communication between various elements.




