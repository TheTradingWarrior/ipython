// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    "base/js/utils"
], function(utils){

    return {
        widget_serialization: {
            deserialize: function deserialize_models(value, model) {
                /**
                 * Replace model ids with models recursively.
                 */
                var unpacked;
                if ($.isArray(value)) {
                    unpacked = [];
                    _.each(value, function(sub_value, key) {
                        unpacked.push(deserialize_models(sub_value, model));
                    });
                    return Promise.all(unpacked);
                } else if (value instanceof Object) {
                    unpacked = {};
                    _.each(value, function(sub_value, key) {
                        unpacked[key] = deserialize_models(sub_value, model);
                    });
                    return utils.resolve_promises_dict(unpacked);
                } else if (typeof value === 'string' && value.slice(0,10) === "IPY_MODEL_") {
                    // get_model returns a promise already
                    return model.widget_manager.get_model(value.slice(10, value.length));
                } else {
                    return Promise.resolve(value);
                }
            },
        },
        
        list_of_numbers: {
            deserialize: function (value, model) {
                /* value is a DataView */
                /* create a float64 typed array */
                return new Float64Array(value.buffer)
            },
            serialize: function (value, model) {
                return value;
            },
        }
    }

    

});
