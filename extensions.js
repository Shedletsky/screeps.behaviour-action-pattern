let mod = {};
mod.extend = function(){
    Object.defineProperty(Structure.prototype, 'towers', {
        configurable: true,
        get: function() {
            if(_.isUndefined(this._towers) || this._towersSet != Game.time) {
                this._towersSet = Game.time;
                this._towers = [];
            }
            return this._towers;
        },
        set: function(value) {
            this._towers = value;
        }
    });
    Object.defineProperty(Source.prototype, 'memory', {
        configurable: true,
        get: function() {
            if(_.isUndefined(Memory.sources)) {
                Memory.sources = {};
            }
            if(!_.isObject(Memory.sources)) {
                return undefined;
            }
            return Memory.sources[this.id] = Memory.sources[this.id] || {};
        },
        set: function(value) {
            if(_.isUndefined(Memory.sources)) {
                Memory.sources = {};
            }
            if(!_.isObject(Memory.sources)) {
                throw new Error('Could not set memory extension for sources');
            }
            Memory.sources[this.id] = value;
        }
    });
    Object.defineProperty(RoomPosition.prototype, 'adjacent', {
        configurable: true,
        get: function() {
            if( _.isUndefined(this._adjacent) )  {
                this._adjacent = [];
                for(let x = this.x-1; x < this.x+2; x++){
                    for(let y = this.y-1; y < this.y+2; y++){
                        if( x > 0 && x < 49 && y > 0 && y < 49 ){
                            this._adjacent.push(new RoomPosition(x, y, this.roomName));
                        }
                    }
                }
            }
            return this._adjacent;
        }
    });
    Object.defineProperty(RoomObject.prototype, 'accessibleFields', {
        configurable: true,
        get: function() {
            if ( this.memory && !_.isUndefined(this.memory.accessibleFields) ) {
                return this.memory.accessibleFields;
            } else {
                var fields = this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1, true);
                let walls = _.countBy( fields , "terrain" ).wall;
                var accessibleFields = walls === undefined ? 9 : 9-walls;
                return (this.memory) ? this.memory.accessibleFields = accessibleFields : accessibleFields;
            }
        }
    });
    Object.defineProperty(RoomObject.prototype, 'cloak', {
        configurable: true,
        get: function() {
            const value = Memory.cloaked[this.id];
            if (!value) {
                return false;
            } else if (_.isNumber(value) && Game.time > value) {
                delete Memory.cloaked[this.id];
                return false;
            } else {
                return value;
            }
        },
        set: function(value) {
            if (!value) {
                delete Memory.cloaked[this.id];
                return undefined;
            } else if (_.isNumber(value)) {
                    if (value < Game.time) {
                        value = Game.time + value;
                    }
            } else {
                value = true;
            }
            return Memory.cloaked[this.id] = value;
        }
    });
    Object.defineProperty(Source.prototype, 'container', {
        configurable: true,
        get: function() {
            let that = this;
            if( _.isUndefined(this.memory.container)) {
                this.room.saveContainers();
            };

            if( _.isUndefined(this._container) ) {
                if( this.memory.storage ) {
                    this._container = Game.getObjectById(this.memory.storage);
                    if( !this._container ) delete this.memory.storage;
                }
                else if( this.memory.terminal ) {
                    this._container = Game.getObjectById(this.memory.terminal);
                    if( !this._container ) delete this.memory.terminal;
                }
                else if( this.memory.container ) {
                    this._container = Game.getObjectById(this.memory.container);
                    if( !this._container ) delete this.memory.container;
                } else this._container = null;
            }
            return this._container;
        }
    });
    Object.defineProperty(Mineral.prototype,'memory', {
        configurable: true,
        get: function() {
            if(_.isUndefined(Memory.minerals)) {
                Memory.minerals = {};
            }
            if(!_.isObject(Memory.minerals)) {
                return undefined;
            }
            return Memory.minerals[this.id] = Memory.minerals[this.id] || {};
        },
        set: function(value) {
            if(_.isUndefined(Memory.minerals)) {
                Memory.minerals = {};
            }
            if(!_.isObject(Memory.minerals)) {
                throw new Error('Could not set memory extension for minerals');
            }
            Memory.minerals[this.id] = value;
        }
    });
    Object.defineProperty(Mineral.prototype, 'container', {
        configurable: true,
        get: function() {
            let that = this;
            if( _.isUndefined(this.memory.container)) {
                this.room.saveContainers();
            };

            if( _.isUndefined(this._container) ) {
                if( this.memory.terminal ) {
                    this._container = Game.getObjectById(this.memory.terminal);
                    if( !this._container ) delete this.memory.terminal;
                }
                else if( this.memory.storage ) {
                    this._container = Game.getObjectById(this.memory.storage);
                    if( !this._container ) delete this.memory.storage;
                }
                else if( this.memory.container ) {
                    this._container = Game.getObjectById(this.memory.container);
                    if( !this._container ) delete this.memory.container;
                } else this._container = null;
            }
            return this._container;
        }
    });
    Object.defineProperty(Source.prototype, 'link', {
        configurable: true,
        get: function() {
            if( _.isUndefined(this._link) ) {
                if( this.memory.link ) {
                    this._link = Game.getObjectById(this.memory.link);
                    if( !this._link ) delete this.memory.link;
                } else this._link = null;
            }
            return this._link;
        }
    });
    Object.defineProperty(StructureController.prototype, 'memory', {
        configurable: true,
        get: function() {
            if(_.isUndefined(Memory.controllers)) {
                Memory.controllers = {};
            }
            if(!_.isObject(Memory.controllers)) {
                return undefined;
            }
            return Memory.controllers[this.id] = Memory.controllers[this.id] || {};
        },
        set: function(value) {
            if(_.isUndefined(Memory.controllers)) {
                Memory.controllers = {};
            }
            if(!_.isObject(Memory.controllers)) {
                throw new Error('Could not set memory extension for controller');
            }
            Memory.controllers[this.id] = value;
        }
    });
    Object.defineProperty(StructureStorage.prototype, 'sum', {
        configurable: true,
        get: function() {
            if( _.isUndefined(this._sum) || this._sumSet != Game.time ) {
                this._sumSet = Game.time;
                this._sum = _.sum(this.store);
            }
            return this._sum;
        }
    });
    Object.defineProperty(StructureStorage.prototype, 'charge', { // fraction indicating charge % relative to constants
        configurable: true,
        get: function() {
            // TODO per-room strategy
            const max = MAX_STORAGE_ENERGY[this.room.controller.level];
            const min = MIN_STORAGE_ENERGY[this.room.controller.level];
            if (max === min) {
                if (this.store.energy > max) {
                    return Infinity;
                } else {
                    return -Infinity;
                }
            }
            const chargeScale = 1 / (max - min); // TODO cache

            return (this.store.energy - max) * chargeScale + 1;
        },
    });
    StructureStorage.prototype.getNeeds = function(resourceType) {
        var ret = 0;
        if (!this.room.memory.resources) return 0;

        let storageData = this.room.memory.resources.storage[0];
        // look up resource and calculate needs
        let order = null;
        if (storageData) order = storageData.orders.find((o)=>{return o.type==resourceType;});
        if (!order) order = { orderAmount: 0, orderRemaining: 0, storeAmount: 0 };
        let rcl = this.room.controller.level;
        let loadTarget = Math.max(order.orderRemaining + (this.store[resourceType]||0), order.storeAmount + ((resourceType == RESOURCE_ENERGY) ? MIN_STORAGE_ENERGY[rcl] : MAX_STORAGE_MINERAL));
        // storage always wants energy
        let unloadTarget = (resourceType == RESOURCE_ENERGY) ? (this.storeCapacity-this.sum)+this.store.energy : order.orderAmount + order.storeAmount + MAX_STORAGE_MINERAL;
        if (unloadTarget < 0) unloadTarget = 0;
        let store = this.store[resourceType]||0;
        if (store < loadTarget) ret = Math.min(loadTarget-store,this.storeCapacity-this.sum);
        else if (store > unloadTarget*1.05) ret = unloadTarget-store;
        return ret;
    };
    Object.defineProperty(StructureTerminal.prototype, 'sum', {
        configurable: true,
        get: function() {
            if( _.isUndefined(this._sum) || this._sumSet != Game.time ) {
                this._sumSet = Game.time;
                this._sum = _.sum(this.store);
            }
            return this._sum;
        }
    });
    StructureTerminal.prototype.getNeeds = function(resourceType) {
        var ret = 0;
        if (!this.room.memory.resources) return 0;
        let terminalData = this.room.memory.resources.terminal[0];
        // look up resource and calculate needs
        let order = null;
        if (terminalData) order = terminalData.orders.find((o)=>{return o.type==resourceType;});
        if (!order) order = { orderAmount: 0, orderRemaining: 0, storeAmount: 0 };
        let loadTarget = Math.max(order.orderRemaining + (this.store[resourceType]||0), order.storeAmount + ((resourceType == RESOURCE_ENERGY) ? TERMINAL_ENERGY : 0));
        let unloadTarget = order.orderAmount + order.storeAmount + ((resourceType == RESOURCE_ENERGY) ? TERMINAL_ENERGY : 0);
        if (unloadTarget < 0) unloadTarget = 0;
        let store = this.store[resourceType]||0;
        if (store < loadTarget) ret = Math.min(loadTarget-store,this.storeCapacity-this.sum);
        else if (store > unloadTarget*1.05) ret = unloadTarget-store;
        return ret;
    };
    Object.defineProperty(StructureContainer.prototype, 'sum', {
        configurable: true,
        get: function() {
            if( _.isUndefined(this._sum) || this._sumSet != Game.time ) {
                this._sumSet = Game.time;
                this._sum = _.sum(this.store);
            }
            return this._sum;
        }
    });
    StructureContainer.prototype.getNeeds = function(resourceType) {
        if (!this.room.memory.resources) return 0;

        // look up resource and calculate needs
        let containerData = this.room.memory.resources.container.find( (s) => s.id == this.id );
        if (containerData) {
            let order = containerData.orders.find((o)=>{return o.type==resourceType;});
            if (order) {
                let loadTarget = Math.max(order.orderRemaining + (this.store[resourceType]||0), order.storeAmount);
                let unloadTarget = order.orderAmount + order.storeAmount;
                if (unloadTarget < 0) unloadTarget = 0;
                let store = this.store[resourceType] || 0;
                if (store < loadTarget) return Math.min(loadTarget-store,this.storeCapacity-this.sum);
                if (store > unloadTarget*1.05) return unloadTarget-store;
            }
        }
        return 0;
    };
    StructureLab.prototype.getNeeds = function(resourceType) {
        if (!this.room.memory.resources) return 0;
        let loadTarget = 0;
        let unloadTarget = 0;

        // look up resource and calculate needs
        let containerData = this.room.memory.resources.lab.find( (s) => s.id == this.id );
        if (containerData) {
            let order = containerData.orders.find((o)=>{return o.type==resourceType;});
            if (order) {
                let amt = 0;
                if (resourceType == RESOURCE_ENERGY) amt = this.energy;
                else if (resourceType == this.mineralType) amt = this.mineralAmount;
                loadTarget = Math.max(order.orderRemaining + amt, order.storeAmount);
                unloadTarget = order.orderAmount + order.storeAmount;
                if (unloadTarget < 0) unloadTarget = 0;
            }
        }
        let store = 0;
        let space = 0;
        if (resourceType == RESOURCE_ENERGY) {
            store = this.energy;
            space = this.energyCapacity-this.energy;
        } else {
            if (this.mineralType == resourceType) store = this.mineralAmount;
            space = this.mineralCapacity-this.mineralAmount;
        }
        if( store < loadTarget / 2 ) return Math.min( loadTarget-store,space );
        if( containerData && containerData.reactionState === 'idle' && store > unloadTarget ) return unloadTarget-store;
        if( store > unloadTarget + ( this.energyCapacity - Math.min(unloadTarget,this.energyCapacity) ) / 2 ) return unloadTarget-store;
        return 0;
    };
    StructurePowerSpawn.prototype.getNeeds = function(resourceType) {
        if (!this.room.memory.resources || !this.room.memory.resources.powerSpawn) return 0;
        // if parameter is enabled then autofill powerSpawns
        if( FILL_POWERSPAWN ) {
            if( resourceType == RESOURCE_ENERGY && this.energy < this.energyCapacity * 0.75 ) {
                return this.energyCapacity - this.energy;
            }
            if( resourceType == RESOURCE_POWER && this.power < this.powerCapacity * 0.25 ) {
                return this.powerCapacity - this.power;
            }
            return 0;
        }
        let loadTarget = 0;
        let unloadTarget = 0;

        // look up resource and calculate needs
        let containerData = this.room.memory.resources.powerSpawn.find( (s) => s.id == this.id );
        if (containerData) {
            let order = containerData.orders.find((o)=>{return o.type==resourceType;});
            if (order) {
                let amt = 0;
                if (resourceType == RESOURCE_ENERGY) amt = this.energy;
                else if (resourceType == RESOURCE_POWER) amt = this.power;
                loadTarget = Math.max(order.orderRemaining + amt, order.storeAmount);
                unloadTarget = order.orderAmount + order.storeAmount;
                if (unloadTarget < 0) unloadTarget = 0;
            }
        }
        let store = 0;
        let space = 0;
        if (resourceType == RESOURCE_ENERGY) {
            store = this.energy;
            space = this.energyCapacity-this.energy;
        } else if (resourceType == RESOURCE_POWER) {
            store = this.power;
            space = this.powerCapacity-this.power;
        }
        if (store < loadTarget) return Math.min(loadTarget-store,space);
        if (store > unloadTarget * 1.05) return unloadTarget-store;
        return 0;
    };

    if( Memory.pavementArt === undefined ) Memory.pavementArt = {};
};
module.exports = mod;

        /*
        Object.defineProperty(Structure.prototype, 'memory', {
            configurable: true,
            get: function() {
                if(_.isUndefined(Memory.structures)) {
                    Memory.structures = {};
                }
                if(!_.isObject(Memory.structures)) {
                    return undefined;
                }
                return Memory.structures[this.id] = Memory.structures[this.id] || {};
            },
            set: function(value) {
                if(_.isUndefined(Memory.structures)) {
                    Memory.structures = {};
                }
                if(!_.isObject(Memory.structures)) {
                    throw new Error('Could not set memory extension for structures');
                }
                Memory.structures[this.id] = value;
            }
        });
        */
        