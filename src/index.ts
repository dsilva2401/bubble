import express = require('express');
import http = require('http');
import https = require('https');
import Q = require('q');
import pem = require('pem');
import subdomain = require('subdomain');
import path = require('path');

class Bubble {

	// Attributes
	private isRoot: Boolean;
	private parentBubble: Bubble;
	private httpServer: any;
	private httpsServer: any;
	public libs: Object;
	public logger: Function;
	public config: Object;
	public app: any;
	public databases: Object;
	public agents: Object;
	public childs: Object;
	public interfaces: Object;
	public transporters: Object;
	public controllers: Object;

	// Constructor
	public constructor (config: Object, parentBubble: any) {
		// Initializing attributes
			var isRoot = !!!parentBubble;	
			var self:any = this;
			this.app = express();
			this.childs = {};
			this.libs = (parentBubble || {}).libs || {};
			this.interfaces = {};
			this.agents = {};
			this.databases = {};
			this.transporters = {};
			this.controllers = {};
			this.parentBubble = parentBubble;

		// Set config
			this.config = config;

		// Verify constructor parameters
			this.isRoot = isRoot;
			// Basics
			if (isRoot && !config.domain) { (this.logger || console.log)('Error: config.domain not defined'); return; }
			// HTTP
			if (isRoot && !config.http) { (this.logger || console.log)('Error: config.http not defined'); return; }
			if (isRoot && !config.http.port) { (this.logger || console.log)('Error: config.http.port not defined'); return; }
			// HTTPS
			if (isRoot && !config.https) { (this.logger || console.log)('Error: config.https not defined'); return; }
			if (isRoot && !config.https.port) { (this.logger || console.log)('Error: config.https.port not defined'); return; }

		// Initialize HTTP Servers
			this.httpServer = http.createServer(this.app);
			this.httpsServer = https.createServer( ( (config.https || {}).options || {}), this.app);

		// Initialize subdomain middleware
			if (isRoot) this.app.use(subdomain({ base : this.config.domain, removeWWW : true }));
	}

	// Methods
	private _dependencies (): Object {
		return {
			'$app': this.app,
			'$config': this.config,
			'$databases': this.databases,
			'$libs': this.libs,
			'$logger': this.logger,
			'$agents': this.agents,
			'$express': express,
			'$interfaces': this.interfaces,
			'$q': Q,
			'$transporters': this.transporters,
			'$controllers': this.controllers,
			'$parent': this.parentBubble
		};
	}

	private _resolveDependencies (fn: Function): Array<Object> {
		var self: any = this;
		var strFn: string = fn.toString();
		var dependencies: Array<string> = strFn.substring(
			strFn.indexOf('(')+1,
			strFn.indexOf(')')
		).split(',');
		var linkedDependencies: Array<any> = [];
		dependencies.forEach(function (d) {
			d = d.replace(/ /g, '');
			linkedDependencies.push(self._dependencies()[d]);
		});
		return linkedDependencies;
	}

	public _resolveFunction (fn: Function): any {
		var solvedDependencies: Array<any> = this._resolveDependencies(fn);
		var fParams:any = [];
		var r: any;
		solvedDependencies.forEach(function (d, index) {
			fParams.push( 'solvedDependencies['+index+']' );
		});
		eval('r = fn(' + fParams.join(',') + ');');
		return r;
	}

	public run (fn: Function) {
		this._resolveFunction(fn);
	}

	public install (appName: String, bubble: any) {
		this.childs[appName] = bubble;
		this.app.use('/subdomain/' + appName, bubble.app);
		if (this.logger) bubble.enableLogging(this.logger);
	}

	public enableLogging (logger?: Function) {
		this.logger = logger || console.log;
	}

	public up () {
		var self:any = this;
		if (!self.isRoot) { (this.logger || console.log)('Error: Can\'t call up method, this bubble is not root'); return; }
		this.httpServer.listen(this.config.http.port, function () {
			if (self.logger) self.logger('HTTP up at '+self.config.domain);
		});
		this.httpsServer.listen(this.config.https.port, function () {
			if (self.logger) self.logger('HTTPS up at '+self.config.domain+':'+self.config.https.port);
		});
	}
}

export = Bubble;
