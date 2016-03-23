import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {HTTP_BINDINGS} from 'angular2/http';


bootstrap(AppComponent)
	.catch(err => console.error(err));