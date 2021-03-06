/**
 * we gonna treat the FunctionType as a very special "EntityType"
 * 
 * data properties will be the parameters
 * 
 * and return (if return type is not empty) is a data property
 * 
 * ==== IMPORTANT ====
 * 
 * FunctionType member isAbstract has to be true, because at lease one key property is mandatory for EntityType 
 */
var FunctionType = (function () {
  var __nextAnonIx = 0;

  var ctor = function FunctionType(config) {
    if (arguments.length > 1) {
      throw new Error("The EntityType ctor has a single argument that is either a 'MetadataStore' or a configuration object.");
    }
    if (config._$typeName === "MetadataStore") {
      this.metadataStore = config;
      this.shortName = "Anon_" + (++__nextAnonIx);
      this.namespace = "";
      this.isAnonymous = true;
    } else {
      assertConfig(config)
          .whereParam("shortName").isNonEmptyString()
          .whereParam("namespace").isString().isOptional().withDefault("")
          .whereParam("isAbstract").isBoolean().isOptional().withDefault(true)
          .whereParam("isBindable").isBoolean().isOptional().withDefault(false)
          .whereParam("isBound").isBoolean().isOptional().withDefault(false)
          .whereParam("isComposable").isBoolean().isOptional().withDefault(false)
          .whereParam("functionName").isOptional().isString().withDefault(null)
          .whereParam("isFunctionImport").isBoolean().isOptional().withDefault(false)
          .whereParam("entityType").isOptional().withDefault(null)
          .whereParam("returnType").isOptional().withDefault(null)
          .whereParam("httpMethod").isOptional().isString().withDefault('GET')
          .applyAll(this);
    }
    
    this.name = qualifyTypeName(this.shortName, this.namespace);
    // for function import
    // this.isFunctionImport = false;

    // for function (bound)
    // this.entityType = null;

    // if a function is not bound
    // then isFunctionImport == false && entityType == null

    // for return type
    // this.returnType = null;

    // we gonna keep exact copies of fields as EntityType, otherwise, lots of things will be unexpected
    this.dataProperties = [];
    this.navigationProperties = [];
    this.complexProperties = [];
    this.keyProperties = [];
    this.foreignKeyProperties = [];
    this.inverseForeignKeyProperties = [];
    this.concurrencyProperties = [];
    this.unmappedProperties = []; // will be updated later.
    this.validators = [];
    this.warnings = [];
    this._mappedPropertiesCount = 0;
    this.subtypes = [];
    
    // the real function that will be called
    this.callFunction = null;
  };
  var proto = ctor.prototype;
  var parseRawValue = DataType.parseRawValue;
  proto._$typeName = "FunctionType";
  ctor.qualifyTypeName = qualifyTypeName;

  // inherits from EntityType for the ease of query
  proto.__proto__ = EntityType.prototype;
  proto.constructor = FunctionType;

  return ctor;
})();

breeze.FunctionType = FunctionType;
