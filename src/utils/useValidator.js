import React, { useCallback, useState } from "react";
import deepMerge from "deepmerge";
import { isPlainObject } from "is-plain-object";

const isMergeableObject = (o) => {
  return isPlainObject(o) || o.constructor.name === "Array";
};

export const combineMerge = (
  target,
  source,
  options = { isMergeableObject: isMergeableObject }
) => {
  const destination = target.slice();
  source.forEach((item, index) => {
    if (typeof destination[index] === "undefined") {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (isMergeableObject(item)) {
      destination[index] = deepMerge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};

export const createFakeEvent = (value) => ({
  target: { value: value },
  deletedata: { value: value },
  persist: () => {},
});

export const createMergeableObject = (str) => (value) => {
  const createObjectOrArray = (key) => (value) => {
    if (isNaN(parseInt(key))) return { [key]: value };
    else {
      const array = [];
      array[key] = value;
      return array;
    }
  };
  if (typeof str === "string" && str) {
    if (str.includes(".") || str.includes("[")) {
      str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
      str = str.replace(/^\./, ""); // strip a leading dot
      const stages = str.split(".");
      let finalObject = createObjectOrArray(stages.pop())(value);
      for (let i = stages.length - 1; i >= 0; i--) {
        finalObject = createObjectOrArray(stages[i])(finalObject);
      }
      return finalObject;
    } else return { [str]: value };
  } else return { [str]: value };
};

export const getByString = (o, s) => {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

const flatten = (obj = {}, prefix = "", res = {}) =>
  Object.entries(obj).reduce((r, [key, val]) => {
    const k = `${prefix}${key}`;
    const getOperator = (k) =>
      isNaN(parseInt(k.split(".").pop()))
        ? `${k}.`
        : `${k.split(".").slice(0, -1).join(".")}[${k.split(".").pop()}].`;
    if (val && typeof val === "object") {
      flatten(val, getOperator(k), r);
    } else {
      res[k] = val;
    }
    return r;
  }, res);

export const getAllSelectorsFromNestedObject = (object = {}, newValue) => {
  const objectWithNewValue = flatten(object);
  for (const i in objectWithNewValue) objectWithNewValue[i] = newValue;
  return objectWithNewValue;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    case "SET_FIELD_VALUE":
      return {
        ...state,
        values: deepMerge(state.values, action.payload, {
          arrayMerge: combineMerge,
        }),
      };
    // case 'DELETE_ITEM':
    // return {
    //   ...state,
    //   values: deepMerge(state.values, action.payload, {
    //     arrayMerge: combineMergeTwo,
    //   }),
    // };
    case "SET_FIELD_TOUCHED":
      return {
        ...state,
        touched: {
          ...state.touched,
          ...action.payload,
        },
      };
    case "SET_VALUES":
      return {
        ...state,
        values: action.payload,
      };
    case "SUBMIT_ATTEMPT":
      return {
        ...state,
        isSubmitting: true,
        touched: getAllSelectorsFromNestedObject(state.values, true),
      };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
      };
    case "SUBMIT_FAILURE":
      return {
        ...state,
        isSubmitting: false,
        submitError: action.payload,
      };
    case "CLEAR_STATE":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const useValidator = (props) => {
  if (!props.onSubmit) {
    throw new Error("You forgot to pass onSubmit to useValidator!");
  }
  if (!props.validate && !props.validationSchema) {
    throw new Error(
      "You forgot to pass validate or validationSchema to useValidator!"
    );
  }

  const [state, dispatch] = React.useReducer(reducer, {
    values: props.initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const validate = useCallback(
    (values) => {
      if (props.validate) {
        return props.validate(values);
      } else if (props.validationSchema) {
        try {
          props.validationSchema.validateSync(values, {
            abortEarly: false,
          });
        } catch (e) {
          const errors = {};
          if (Array.isArray(e.inner)) {
            for (const err of e.inner) {
              errors[err.path] = err.message;
            }
            return errors;
          }
          return errors;
        }
        return {};
      }
    },
    [props.validate, props.validationSchema]
  );

  React.useEffect(() => {
    if (props.validate || props.validationSchema) {
      const errors = validate(state.values);
      dispatch({ type: "SET_ERRORS", payload: errors });
    }
  }, [state.values]);

  const setValues = (values) =>
    dispatch({
      type: "SET_VALUES",
      payload: values,
    });

  const handleChange = (fieldName) => (event) => {
    // eslint-disable-next-line no-unused-expressions
    event?.persist();
    dispatch({
      type: "SET_FIELD_VALUE",
      payload: createMergeableObject(fieldName)(
        event.target?.type === "checkbox"
          ? event.target.checked
          : event.target.value
      ),
    });
  };
  // const handleDelete = (fieldName) => (event) => {
  //   // eslint-disable-next-line no-unused-expressions
  //   event?.persist();
  //   dispatch({
  //     type: 'DELETE_ITEM',
  //     payload: createMergeableObject(fieldName)(
  //       event.target?.type === 'checkbox'
  //         ? event.target.checked
  //         : event.target.value,
  //     ),
  //   });
  // };
  const clearFormState = () => {
    dispatch({
      type: "CLEAR_STATE",
      payload: {
        values: props.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
      },
    });
  };

  const handleBlur = (fieldName) => (event) => {
    dispatch({
      type: "SET_FIELD_TOUCHED",
      payload: { [fieldName]: true },
    });
  };

  const getFieldProps = (fieldName) => ({
    value: state.values[fieldName] ?? "",
    onChange: handleChange(fieldName),
    onBlur: handleBlur(fieldName),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: "SUBMIT_ATTEMPT" });
    const errors = validate(state.values);
    if (!Object.keys(errors).length) {
      try {
        await props.onSubmit(state.values);
        dispatch({ type: "SUBMIT_SUCCESS" });
      } catch (submitError) {
        dispatch({ type: "SUBMIT_FAILURE", payload: submitError });
      }
    } else {
      dispatch({ type: "SET_ERRORS", payload: errors });
      dispatch({ type: "SUBMIT_FAILURE" });
    }
  };
  return {
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    getFieldProps,
    clearFormState,
    // handleDelete,
    ...state,
  };
};

export default useValidator;
