import {expect} from "chai";
import * as fn from "./functions";

describe("Module function tests", () => {

    it("can populate an object given an array of keys", () => {
        const array = ["key1", "key2", "key3"];
        const obj = {};
        const result = fn.arrayIntoObj(array, obj, "result");
        const expected = {"key1": {"key2": {"key3": "result"}}};

        expect(result).to.deep.equal(expected);
    });

    it("can unflatten a form data object", () => {
        const formData = {
            "form:field": "value",
            "form:data:extra": "value2",
            "more": "value3",
            "some:data": "value4"
        };
        const expected = {
            "form": {
                "field": "value",
                "data": {
                    "extra": "value2"
                }
            },
            "more": "value3",
            "some": {
                "data": "value4"
            }
        };

        expect(fn.unflattenFormData(formData)).to.deep.equal(expected);
    });

    it("leaves unflattened data as is", () => {
        const expected = {
            "form": {
                "field": "value",
                "data": {
                    "extra": "value2"
                }
            },
            "more": "value3",
            "some": {
                "data": "value4"
            }
        };
        expect(fn.unflattenFormData(expected)).to.deep.equal(expected);
    });

    it("merges values from some form data with a schema", () => {
        const formData = {
            "form:data": "value",
            "data": "value2",
            "some:more:data": "value3",
            "ignoreme": "leave"
        };
        const schema = {
            "@type": "Thing",
            "form": {
                "data": ""
            },
            "data": "",
            "some": {
                "more": {
                    "data": ""
                }
            }
        };
        const result = {
            "@type": "Thing",
            "form": {
                "data": "value"
            },
            "data": "value2",
            "some": {
                "more": {
                    "data": "value3"
                }
            }
        };
        expect(fn.mergeFormWithSchema(formData, schema)).to.deep.equal(result);
    });

    it("can handle an array of objects", () => {
        const formData = {
            "formArray": [
                {"obj": "1"},
                {"obj": "2"},
                {"obj": "3"}
            ]
        };
        const schema = {
            "formArray": [
                {"keep": "this", "obj": ""}
            ]
        };
        const result = {
            "formArray": [
                {"keep": "this", "obj": "1"},
                {"keep": "this", "obj": "2"},
                {"keep": "this", "obj": "3"},
            ]
        };
        expect(fn.mergeFormWithSchema(formData, schema)).to.deep.equal(result);
    });

    it("can handle a plain array", () => {
        const formData = {
            "stringArray": ["val", "val2", "val3"]
        };
        const schema = {
            "stringArray": [""]
        };
        expect(fn.mergeFormWithSchema(formData, schema)).to.deep.equal(formData);
    });

});