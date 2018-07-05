export const arrayIntoObj = (array: Array<any>, obj: object, value: any): object => {
    let retObj = obj;
    if(array.length > 1) {
        retObj[array[0]] = {...retObj[array[0]], ...arrayIntoObj(array.splice(1), {}, value)};
    } else {
        retObj[array[0]] = value;
    }
    return retObj;
};

export const unflattenFormData = (formData: object): object => {
    let expanded: object = {};
    let finalForm: object = {};
    for(let prop in formData) {
        if(prop.indexOf(":") > 0) {
            expanded = {...expanded, ...arrayIntoObj(prop.split(":"), expanded, formData[prop])};
            delete formData[prop];
        }
    }
    finalForm ={...formData, ...expanded};
    return finalForm;
};

// Fleshes out the schema's arrays with duplicate objects or empty strings to the length of the array sent in formData.
const lengthenArrays = (formData: object, objMap: object): object => {
    let returnObj: object = objMap;
    for(let prop in objMap) {
        if(!isNaN(parseInt(prop, 10)) && formData.hasOwnProperty(prop)) {
            for(let i=0; i<Object.keys(formData).length; i++) {
                if(typeof objMap[prop] === "object") {
                    returnObj[i] = {...objMap[0]};
                }
                if(typeof objMap[prop] === "string") {
                    returnObj[i] = "";
                }
            }
        }
    }
    return returnObj;
};

export const formToObjectMapping = (formData: object, objMap: object, write: boolean = true): object => {
    let returnObj: object = lengthenArrays(formData, objMap); // Arrays can be deep inside schema object, so need to do this every time.
    for(let prop in objMap) {
        if(typeof objMap[prop] === "string" && formData.hasOwnProperty(prop) && write) {
            returnObj[prop] = formData[prop];
        }
        if(typeof objMap[prop] === "object") {
            for(let formProp in formData) {
                if(typeof formData[formProp] === "object") {
                    const write = formProp === prop; // This prevents data buried in an array from being overwritten.
                    returnObj[prop] = formToObjectMapping(formData[formProp], objMap[prop], write);
                }
            }
        }
    }
    return returnObj;
};

export const mergeFormWithSchema = (formData: object, objMap: object): object => {
    let fullData = unflattenFormData(formData);
    return formToObjectMapping(fullData, objMap);
};