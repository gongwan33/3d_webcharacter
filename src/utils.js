function deepCopy ( obj ) {
    var clone = {};
    for(var i in obj) {
        if(obj[i] != null &&  typeof(obj[i])=="object")
            clone[i] = deepCopy(obj[i]);
        else
            clone[i] = obj[i];
    }

    return clone;
}

export default {
    deepCopy,
}
