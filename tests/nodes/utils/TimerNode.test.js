(function (exports) {
	'use strict';

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// WARNING: This file was auto-generated, any change will be overridden in next release. Please use configs/es6.conf.js then run "npm run convert". //
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var _Math = {

		DEG2RAD: Math.PI / 180,
		RAD2DEG: 180 / Math.PI,

		generateUUID: ( function () {

			// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

			var lut = [];

			for ( var i = 0; i < 256; i ++ ) {

				lut[ i ] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 );

			}

			return function generateUUID() {

				var d0 = Math.random() * 0xffffffff | 0;
				var d1 = Math.random() * 0xffffffff | 0;
				var d2 = Math.random() * 0xffffffff | 0;
				var d3 = Math.random() * 0xffffffff | 0;
				var uuid = lut[ d0 & 0xff ] + lut[ d0 >> 8 & 0xff ] + lut[ d0 >> 16 & 0xff ] + lut[ d0 >> 24 & 0xff ] + '-' +
					lut[ d1 & 0xff ] + lut[ d1 >> 8 & 0xff ] + '-' + lut[ d1 >> 16 & 0x0f | 0x40 ] + lut[ d1 >> 24 & 0xff ] + '-' +
					lut[ d2 & 0x3f | 0x80 ] + lut[ d2 >> 8 & 0xff ] + '-' + lut[ d2 >> 16 & 0xff ] + lut[ d2 >> 24 & 0xff ] +
					lut[ d3 & 0xff ] + lut[ d3 >> 8 & 0xff ] + lut[ d3 >> 16 & 0xff ] + lut[ d3 >> 24 & 0xff ];

				// .toUpperCase() here flattens concatenated strings to save heap memory space.
				return uuid.toUpperCase();

			};

		} )(),

		clamp: function ( value, min, max ) {

			return Math.max( min, Math.min( max, value ) );

		},

		// compute euclidian modulo of m % n
		// https://en.wikipedia.org/wiki/Modulo_operation

		euclideanModulo: function ( n, m ) {

			return ( ( n % m ) + m ) % m;

		},

		// Linear mapping from range <a1, a2> to range <b1, b2>

		mapLinear: function ( x, a1, a2, b1, b2 ) {

			return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

		},

		// https://en.wikipedia.org/wiki/Linear_interpolation

		lerp: function ( x, y, t ) {

			return ( 1 - t ) * x + t * y;

		},

		// http://en.wikipedia.org/wiki/Smoothstep

		smoothstep: function ( x, min, max ) {

			if ( x <= min ) return 0;
			if ( x >= max ) return 1;

			x = ( x - min ) / ( max - min );

			return x * x * ( 3 - 2 * x );

		},

		smootherstep: function ( x, min, max ) {

			if ( x <= min ) return 0;
			if ( x >= max ) return 1;

			x = ( x - min ) / ( max - min );

			return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

		},

		// Random integer from <low, high> interval

		randInt: function ( low, high ) {

			return low + Math.floor( Math.random() * ( high - low + 1 ) );

		},

		// Random float from <low, high> interval

		randFloat: function ( low, high ) {

			return low + Math.random() * ( high - low );

		},

		// Random float from <-range/2, range/2> interval

		randFloatSpread: function ( range ) {

			return range * ( 0.5 - Math.random() );

		},

		degToRad: function ( degrees ) {

			return degrees * _Math.DEG2RAD;

		},

		radToDeg: function ( radians ) {

			return radians * _Math.RAD2DEG;

		},

		isPowerOfTwo: function ( value ) {

			return ( value & ( value - 1 ) ) === 0 && value !== 0;

		},

		ceilPowerOfTwo: function ( value ) {

			return Math.pow( 2, Math.ceil( Math.log( value ) / Math.LN2 ) );

		},

		floorPowerOfTwo: function ( value ) {

			return Math.pow( 2, Math.floor( Math.log( value ) / Math.LN2 ) );

		}

	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function Node( type ) {

		this.uuid = _Math.generateUUID();

		this.name = "";

		this.type = type;

		this.userData = {};

	}

	Node.prototype = {

		constructor: Node,

		isNode: true,

		parse: function ( builder, settings ) {

			settings = settings || {};

			builder.parsing = true;

			this.build( builder.addFlow( settings.slot, settings.cache, settings.context ), 'v4' );

			builder.clearVertexNodeCode();
			builder.clearFragmentNodeCode();

			builder.removeFlow();

			builder.parsing = false;

		},

		parseAndBuildCode: function ( builder, output, settings ) {

			settings = settings || {};

			this.parse( builder, settings );

			return this.buildCode( builder, output, settings );

		},

		buildCode: function ( builder, output, settings ) {

			settings = settings || {};

			var data = { result: this.build( builder.addFlow( settings.slot, settings.cache, settings.context ), output ) };

			data.code = builder.clearNodeCode();

			builder.removeFlow();

			return data;

		},

		build: function ( builder, output, uuid ) {

			output = output || this.getType( builder, output );

			var data = builder.getNodeData( uuid || this );

			if ( builder.parsing ) {

				this.appendDepsNode( builder, data, output );

			}

			if ( builder.nodes.indexOf( this ) === - 1 ) {

				builder.nodes.push( this );

			}

			if ( this.updateFrame !== undefined && builder.updaters.indexOf( this ) === - 1 ) {

				builder.updaters.push( this );

			}

			return this.generate( builder, output, uuid );

		},

		appendDepsNode: function ( builder, data, output ) {

			data.deps = ( data.deps || 0 ) + 1;

			var outputLen = builder.getTypeLength( output );

			if ( outputLen > ( data.outputMax || 0 ) || this.getType( builder, output ) ) {

				data.outputMax = outputLen;
				data.output = output;

			}

		},

		setName: function ( name ) {

			this.name = name;

			return this;

		},

		getName: function ( builder ) {

			return this.name;

		},

		getType: function ( builder, output ) {

			return output === 'sampler2D' || output === 'samplerCube' ? output : this.type;

		},

		getJSONNode: function ( meta ) {

			var isRootObject = ( meta === undefined || typeof meta === 'string' );

			if ( ! isRootObject && meta.nodes[ this.uuid ] !== undefined ) {

				return meta.nodes[ this.uuid ];

			}

		},

		copy: function ( source ) {

			if ( source.name !== undefined ) this.name = source.name;

			if ( source.userData !== undefined ) this.userData = JSON.parse( JSON.stringify( source.userData ) );

		},

		createJSONNode: function ( meta ) {

			var isRootObject = ( meta === undefined || typeof meta === 'string' );

			var data = {};

			if ( typeof this.nodeType !== "string" ) throw new Error( "Node does not allow serialization." );

			data.uuid = this.uuid;
			data.nodeType = this.nodeType;

			if ( this.name !== "" ) data.name = this.name;

			if ( JSON.stringify( this.userData ) !== '{}' ) data.userData = this.userData;

			if ( ! isRootObject ) {

				meta.nodes[ this.uuid ] = data;

			}

			return data;

		},

		toJSON: function ( meta ) {

			return this.getJSONNode( meta ) || this.createJSONNode( meta );

		}

	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function TempNode( type, params ) {

		Node.call( this, type );

		params = params || {};

		this.shared = params.shared !== undefined ? params.shared : true;
		this.unique = params.unique !== undefined ? params.unique : false;

	}

	TempNode.prototype = Object.create( Node.prototype );
	TempNode.prototype.constructor = TempNode;

	TempNode.prototype.build = function ( builder, output, uuid, ns ) {

		output = output || this.getType( builder );

		if ( this.getShared( builder, output ) ) {

			var isUnique = this.getUnique( builder, output );

			if ( isUnique && this.constructor.uuid === undefined ) {

				this.constructor.uuid = _Math.generateUUID();

			}

			uuid = builder.getUuid( uuid || this.getUuid(), ! isUnique );

			var data = builder.getNodeData( uuid ),
				type = data.output || this.getType( builder );

			if ( builder.parsing ) {

				if ( ( data.deps || 0 ) > 0 || this.getLabel() ) {

					this.appendDepsNode( builder, data, output );

					return this.generate( builder, output, uuid );

				}

				return Node.prototype.build.call( this, builder, output, uuid );

			} else if ( isUnique ) {

				data.name = data.name || Node.prototype.build.call( this, builder, output, uuid );

				return data.name;

			} else if ( ! this.getLabel() && ( ! this.getShared( builder, type ) || ( ! builder.optimize || data.deps === 1 ) ) ) {

				return Node.prototype.build.call( this, builder, output, uuid );

			}

			uuid = this.getUuid( false );

			var name = this.getTemp( builder, uuid );

			if ( name ) {

				return builder.format( name, type, output );

			} else {

				name = TempNode.prototype.generate.call( this, builder, output, uuid, data.output, ns );

				var code = this.generate( builder, type, uuid );

				builder.addNodeCode( name + ' = ' + code + ';' );

				return builder.format( name, type, output );

			}

		}

		return Node.prototype.build.call( this, builder, output, uuid );

	};

	TempNode.prototype.getShared = function ( builder, output ) {

		return output !== 'sampler2D' && output !== 'samplerCube' && this.shared;

	};

	TempNode.prototype.getUnique = function ( builder, output ) {

		return this.unique;

	};

	TempNode.prototype.setLabel = function ( name ) {

		this.label = name;

		return this;

	};

	TempNode.prototype.getLabel = function ( builder ) {

		return this.label;

	};

	TempNode.prototype.getUuid = function ( unique ) {

		var uuid = unique || unique == undefined ? this.constructor.uuid || this.uuid : this.uuid;

		if ( typeof this.scope === "string" ) uuid = this.scope + '-' + uuid;

		return uuid;

	};

	TempNode.prototype.getTemp = function ( builder, uuid ) {

		uuid = uuid || this.uuid;

		var tempVar = builder.getVars()[ uuid ];

		return tempVar ? tempVar.name : undefined;

	};

	TempNode.prototype.generate = function ( builder, output, uuid, type, ns ) {

		if ( ! this.getShared( builder, output ) ) console.error( "TempNode is not shared!" );

		uuid = uuid || this.uuid;

		return builder.getTempVar( uuid, type || this.getType( builder ), ns, this.getLabel() ).name;

	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function InputNode( type, params ) {

		params = params || {};
		params.shared = params.shared !== undefined ? params.shared : false;

		TempNode.call( this, type, params );

		this.readonly = false;

	}

	InputNode.prototype = Object.create( TempNode.prototype );
	InputNode.prototype.constructor = InputNode;

	InputNode.prototype.setReadonly = function ( value ) {

		this.readonly = value;

		return this;

	};

	InputNode.prototype.getReadonly = function ( builder ) {

		return this.readonly;

	};

	InputNode.prototype.copy = function ( source ) {

		TempNode.prototype.copy.call( this, source );

		if ( source.readonly !== undefined ) this.readonly = source.readonly;

	};

	InputNode.prototype.createJSONNode = function ( meta ) {

		var data = TempNode.prototype.createJSONNode.call( this, meta );

		if ( this.readonly === true ) data.readonly = this.readonly;

		return data;

	};

	InputNode.prototype.generate = function ( builder, output, uuid, type, ns, needsUpdate ) {

		uuid = builder.getUuid( uuid || this.getUuid() );
		type = type || this.getType( builder );

		var data = builder.getNodeData( uuid ),
			readonly = this.getReadonly( builder ) && this.generateReadonly !== undefined;

		if ( readonly ) {

			return this.generateReadonly( builder, output, uuid, type, ns, needsUpdate );

		} else {

			if ( builder.isShader( 'vertex' ) ) {

				if ( ! data.vertex ) {

					data.vertex = builder.createVertexUniform( type, this, ns, needsUpdate, this.getLabel() );

				}

				return builder.format( data.vertex.name, type, output );

			} else {

				if ( ! data.fragment ) {

					data.fragment = builder.createFragmentUniform( type, this, ns, needsUpdate, this.getLabel() );

				}

				return builder.format( data.fragment.name, type, output );

			}

		}

	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function FloatNode( value ) {

		InputNode.call( this, 'f' );

		this.value = value || 0;

	}

	FloatNode.prototype = Object.create( InputNode.prototype );
	FloatNode.prototype.constructor = FloatNode;
	FloatNode.prototype.nodeType = "Float";

	FloatNode.prototype.generateReadonly = function ( builder, output, uuid, type, ns, needsUpdate ) {

		return builder.format( this.value + ( this.value % 1 ? '' : '.0' ), type, output );

	};

	FloatNode.prototype.copy = function ( source ) {

		InputNode.prototype.copy.call( this, source );

		this.value = source.value;

	};

	FloatNode.prototype.toJSON = function ( meta ) {

		var data = this.getJSONNode( meta );

		if ( ! data ) {

			data = this.createJSONNode( meta );

			data.value = this.value;

			if ( this.readonly === true ) data.readonly = true;

		}

		return data;

	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// WARNING: This file was auto-generated, any change will be overridden in next release. Please use configs/es6.conf.js then run "npm run convert". //
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var NodeLib = {

		nodes: {},
		keywords: {},

		add: function ( node ) {

			this.nodes[ node.name ] = node;

		},

		addKeyword: function ( name, callback, cache ) {

			cache = cache !== undefined ? cache : true;

			this.keywords[ name ] = { callback: callback, cache: cache };

		},

		remove: function ( node ) {

			delete this.nodes[ node.name ];

		},

		removeKeyword: function ( name ) {

			delete this.keywords[ name ];

		},

		get: function ( name ) {

			return this.nodes[ name ];

		},

		getKeyword: function ( name, material ) {

			return this.keywords[ name ].callback.call( this, material );

		},

		getKeywordData: function ( name ) {

			return this.keywords[ name ];

		},

		contains: function ( name ) {

			return this.nodes[ name ] != undefined;

		},

		containsKeyword: function ( name ) {

			return this.keywords[ name ] != undefined;

		}

	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function TimerNode( scale, scope, timeScale ) {

		FloatNode.call( this );

		this.scale = scale !== undefined ? scale : 1;
		this.scope = scope || TimerNode.GLOBAL;

		this.timeScale = timeScale !== undefined ? timeScale : scale !== undefined;

	}

	TimerNode.GLOBAL = 'global';
	TimerNode.LOCAL = 'local';
	TimerNode.DELTA = 'delta';

	TimerNode.prototype = Object.create( FloatNode.prototype );
	TimerNode.prototype.constructor = TimerNode;
	TimerNode.prototype.nodeType = "Timer";

	TimerNode.prototype.getReadonly = function () {

		// never use TimerNode as readonly but aways as "uniform"

		return false;

	};

	TimerNode.prototype.getUnique = function () {

		// share TimerNode "uniform" input if is used on more time with others TimerNode

		return this.timeScale && ( this.scope === TimerNode.GLOBAL || this.scope === TimerNode.DELTA );

	};

	TimerNode.prototype.updateFrame = function ( frame ) {

		var scale = this.timeScale ? this.scale : 1;

		switch ( this.scope ) {

			case TimerNode.LOCAL:

				this.value += frame.delta * scale;

				break;

			case TimerNode.DELTA:

				this.value = frame.delta * scale;

				break;

			default:

				this.value = frame.time * scale;

		}

	};

	TimerNode.prototype.copy = function ( source ) {

		FloatNode.prototype.copy.call( this, source );

		this.scope = source.scope;
		this.scale = source.scale;

		this.timeScale = source.timeScale;

	};

	TimerNode.prototype.toJSON = function ( meta ) {

		var data = this.getJSONNode( meta );

		if ( ! data ) {

			data = this.createJSONNode( meta );

			data.scope = this.scope;
			data.scale = this.scale;

			data.timeScale = this.timeScale;

		}

		return data;

	};

	NodeLib.addKeyword( 'time', function () {

		return new TimerNode();

	} );

	exports.TimerNode = TimerNode;

}((this.Three = this.Three || {})));
