import { useState, ChangeEvent } from "react";

const useInputState = (initialValue: string = "") => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return [value, handleChange, reset] as const;
};

export default useInputState;
