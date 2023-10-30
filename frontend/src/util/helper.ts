import moment from "moment";

const formatDate = (date: string, useCount = false, formarter?: string) => {
  const datetime = moment(date);
  const days = datetime.fromNow();
  let _formater = formarter ? formarter : "DD/MM/YYYY";
  return useCount ? days : datetime.format(_formater);
};

const mappingState = (oldState: object, updateObject: object) => {
  const newState = { ...oldState, ...updateObject };
  return newState;
};

const numberFormat = (number: number | string) => {
  if (typeof number === "string") number = parseInt(number);
  if (number < 1000) return number;
  if (number >= 1000 && number < 1000000)
    return (number / 1000).toFixed(1) + "K";
  if (number >= 1000000 && number < 1000000000)
    return (number / 1000000).toFixed(1) + "M";
  if (number >= 1000000000 && number < 1000000000000)
    return (number / 1000000000).toFixed(1) + "B";
  if (number >= 1000000000000) return (number / 1000000000000).toFixed(1) + "T";
};
export default {
  numberFormat,
  formatDate,
  mappingState,
};
