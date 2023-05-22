import { useEffect, useState } from "react";

const useSaveButtonValidation = (fields: string[]): boolean => {
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  useEffect(() => {
    const areAllFieldsFilled = fields.every((field) => field.trim() !== "");
    setIsSaveButtonEnabled(areAllFieldsFilled);
  }, [fields]);

  return isSaveButtonEnabled;
};

export default useSaveButtonValidation;
