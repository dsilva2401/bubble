"use strict";
var express = require('express');
var Q = require('q');
var subdomain = require('subdomain');
var Bubble = (function () {
    // Constructor
    function Bubble(config, isRoot) {
        // Initializing attributes
        var self = this;
        this.app = express();
        this.childs = {};
        this.libs = {};
        // Set config
        this.config = config;
        // Verify constructor parameters
        this.isRoot = isRoot;
        if (isRoot && !config.domain) {
            (this.logger || console.log)('Error: config.domain not defined');
            return;
        }
        if (isRoot && !config.port) {
            (this.logger || console.log)('Error: config.port not defined');
            return;
        }
        // Initialize subdomain middleware
        if (isRoot)
            this.app.use(subdomain({ base: this.config.domain, removeWWW: true }));
    }
    // Methods
    Bubble.prototype._dependencies = function () {
        return {
            '$app': this.app,
            '$config': this.config,
            '$databases': this.databases,
            '$libs': this.libs,
            '$logger': this.logger,
            '$express': express,
            '$interfaces': this.interfaces,
            '$q': Q
        };
    };
    Bubble.prototype._resolveDependencies = function (fn) {
        var self = this;
        var strFn = fn.toString();
        var dependencies = strFn.substring(strFn.indexOf('(') + 1, strFn.indexOf(')')).split(',');
        var linkedDependencies = [];
        dependencies.forEach(function (d) {
            d = d.replace(/ /g, '');
            linkedDependencies.push(self._dependencies()[d]);
        });
        return linkedDependencies;
    };
    Bubble.prototype._resolveFunction = function (fn) {
        var solvedDependencies = this._resolveDependencies(fn);
        var fParams = [];
        var r;
        solvedDependencies.forEach(function (d, index) {
            fParams.push('solvedDependencies[' + index + ']');
        });
        eval('r = fn(' + fParams.join(',') + ');');
        return r;
    };
    Bubble.prototype.run = function (fn) {
        this._resolveFunction(fn);
    };
    Bubble.prototype.install = function (appName, bubble) {
        this.childs[appName] = bubble;
        this.app.use('/subdomain/' + appName, bubble.app);
        if (this.logger)
            bubble.enableLogging(this.logger);
    };
    Bubble.prototype.enableLogging = function (logger) {
        this.logger = logger || console.log;
    };
    Bubble.prototype.up = function () {
        var self = this;
        if (!self.isRoot) {
            (this.logger || console.log)('Error: Can\'t call up method, this bubble is not root');
            return;
        }
        this.app.listen(this.config.port, function () {
            if (self.logger)
                self.logger('Bubble up at ' + self.config.domain + ':' + self.config.port);
        });
    };
    return Bubble;
}());
module.exports = Bubble;
